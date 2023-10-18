package com.cheremushkin.main;

import com.cheremushkin.data.Card;
import com.cheremushkin.data.ClockEvent;
import com.cheremushkin.data.Session;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.apache.flink.api.common.functions.RichFlatMapFunction;
import org.apache.flink.api.common.state.MapState;
import org.apache.flink.api.common.state.MapStateDescriptor;
import org.apache.flink.api.common.state.ValueState;
import org.apache.flink.api.common.state.ValueStateDescriptor;
import org.apache.flink.api.common.typeinfo.TypeInformation;
import org.apache.flink.util.Collector;

import java.util.Random;
import java.util.Spliterator;
import java.util.Spliterators;
import java.util.stream.StreamSupport;

import static com.cheremushkin.data.ClockEvent.CARD_DESCRIPTION;
import static com.cheremushkin.data.ClockEvent.CARD_HEADER;
import static com.cheremushkin.data.ClockEvent.CARD_X;
import static com.cheremushkin.data.ClockEvent.CARD_Y;
import static com.cheremushkin.data.ClockEvent.ID;

@Slf4j
public class MainFunction extends RichFlatMapFunction<ClockEvent, ClockEvent> {

    Random r = new Random();
    ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Information about session. Contains create date, last login date.
     */
    ValueStateDescriptor<Session> sessionDescriptor =
            new ValueStateDescriptor<Session>("session", TypeInformation.of(Session.class));
    /**
     * Active cards. All information about cards. Map key is card id, map value is all card information.
     */
    MapStateDescriptor<String, Card> activeCardsDescriptor =
            new MapStateDescriptor<String, Card>(
                    "sessionActiveCards", TypeInformation.of(String.class), TypeInformation.of(Card.class));
    /**
     * Done cards. All information about cards.
     */
    MapStateDescriptor<String, Card> doneCardsDescriptor =
            new MapStateDescriptor<String, Card>(
                    "sessionDoneCards", TypeInformation.of(String.class), TypeInformation.of(Card.class));

    @Override
    public void flatMap(ClockEvent event, Collector<ClockEvent> out) throws Exception {
        log.info("main {}", event);
        String id;
        ValueState<Session> sessionState = getRuntimeContext().getState(sessionDescriptor);
        MapState<String, Card> activeCardState = getRuntimeContext().getMapState(activeCardsDescriptor);
        MapState<String, Card> doneCardState = getRuntimeContext().getMapState(doneCardsDescriptor);
        switch (event.getType()) {
            case ClockEvent.UI_START_WITHOUT_KEY_EVENT:
                // This session is new. We should create new value for session.
                // and return key inside event (BACKEND_NEW_KEY_EVENT
                Session session = new Session(event.getSessionKey());
                sessionState.update(session);
                ClockEvent newEvent = new ClockEvent(ClockEvent.BACKEND_NEW_KEY_EVENT);
                newEvent.setSessionKey(event.getSessionKey());
                out.collect(newEvent);
                return;
            case ClockEvent.UI_START_WITH_KEY_EVENT:
                // This session already exists.
                // return key inside event (BACKEND_EXISTING_KEY_EVENT
                ClockEvent e = new ClockEvent(ClockEvent.BACKEND_EXISTING_KEY_EVENT);
                String sessionKey = event.getSessionKey();
                e.setSessionKey(sessionKey);

                StreamSupport.stream(Spliterators.spliteratorUnknownSize(activeCardState.iterator(), Spliterator.ORDERED),
                                false)
                        .forEach(
                                entry -> {
                                    out.collect(new ClockEvent(ClockEvent.EMIT_CARD)
                                            .sessionKey(sessionKey)
                                            // todo date
                                            .add(ID, entry.getValue().getId())
                                            .add(CARD_HEADER, entry.getValue().getHeader())
                                            .add(CARD_DESCRIPTION, entry.getValue().getDescription())
                                            .add(CARD_X, String.valueOf(entry.getValue().getX()))
                                            .add(CARD_Y, String.valueOf(entry.getValue().getY()))
                                    );
                                }
                        );
                return;
            case ClockEvent.CARD_GET_ID_EVENT:
                // Event is processed when new card is created and id is generated. This id is sent
                // back to UI
                id = generate(activeCardState, doneCardState);
                activeCardState.put(id, new Card(id));
                out.collect(new ClockEvent(ClockEvent.BACKEND_NEW_ID_EVENT).add(ID, id));
                return;
            case ClockEvent.UPDATE_CARD_EVENT:
                // event is sent when card is updated
                id = event.getData().get(ID);
                Card card = activeCardState.get(id);
                if (event.getData().get(ID) != null) {
                    card.setId(id);
                    if (event.getData().get(CARD_HEADER) != null)
                        card.setHeader(event.getData().get(CARD_HEADER));
                    if (event.getData().get(CARD_DESCRIPTION) != null)
                        card.setDescription(event.getData().get(CARD_DESCRIPTION));
                    if (event.getData().get(CARD_X) != null)
                        card.setX(Integer.valueOf(event.getData().get(CARD_X)));
                    if (event.getData().get(CARD_Y) != null)
                        card.setY(Integer.valueOf(event.getData().get(CARD_Y)));
                    activeCardState.put(card.getId(), card);
                    out.collect(new ClockEvent(ClockEvent.BACKEND_UPDATE_SUCCESS).add(ID, id));
                }
                return;
            case ClockEvent.DELETE_CARD_EVENT:
                // event is sent when card is deleted - moved ti done
                id = event.getData().get(ID);
                Card cardToDelete = activeCardState.get(id);
                activeCardState.remove(cardToDelete.getId());
                doneCardState.put(cardToDelete.getId(), cardToDelete);
                out.collect(new ClockEvent(ClockEvent.BACKEND_UPDATE_SUCCESS).add(ID, id));
                break;
            default:
                out.collect(event);
        }
    }

    /**
     * Generate new key or id. Key consists of 8 hex digits.
     *
     * @return new key or id, that contains 8 hex digits.
     */
    String generate(MapState<String, Card> activeCardState, MapState<String, Card> doneCardState) throws Exception {
        String newKey = null;
        while (newKey == null || activeCardState.contains(newKey) || doneCardState.contains(newKey)) {
            newKey = String.format("%08x", r.nextInt());
        }
        return newKey;
    }
}
