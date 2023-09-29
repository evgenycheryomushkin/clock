package com.cheremushkin.main;

import com.cheremushkin.data.Card;
import com.cheremushkin.data.ClockEvent;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.flink.api.common.functions.RichFlatMapFunction;
import org.apache.flink.api.common.state.MapState;
import org.apache.flink.api.common.state.MapStateDescriptor;
import org.apache.flink.api.common.state.ValueState;
import org.apache.flink.api.common.state.ValueStateDescriptor;
import org.apache.flink.api.common.typeinfo.TypeInformation;
import org.apache.flink.util.Collector;

import java.util.Random;

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
        ValueState<Session> sessionState = getRuntimeContext().getState(sessionDescriptor);
        MapState<String, Card> activeCardState = getRuntimeContext().getMapState(
                activeCardsDescriptor
        );
        switch (event.getType()) {
            case ClockEvent.UI_START_WITHOUT_KEY_EVENT:
                // This session is new. We should create new value for session.
                // and return key inside event (BACKEND_NEW_KEY_EVENT
                Session session = Session.builder().build();
                sessionState.update(session);
                ClockEvent newEvent = new ClockEvent(ClockEvent.BACKEND_NEW_KEY_EVENT);
                newEvent.setSessionKey(event.getSessionKey());
                out.collect(newEvent);
                return;
            case ClockEvent.CARD_GET_ID_EVENT:
                // Event is processed when new card is created and id is generated. This id is sent
                // back to UI
                String id = generate();
                activeCardState.put(id, new Card(id));
                out.collect(new ClockEvent(ClockEvent.BACKEND_NEW_ID_EVENT).add(ClockEvent.ID, id));
                return;
            case ClockEvent.UPDATE_CARD_EVENT:
                // event is sent when card is updated
                Card card = objectMapper.readValue(event.getData().get(ClockEvent.CARD), Card.class);
                activeCardState.put(card.getId(), card);
                return;
            case ClockEvent.DELETE_CARD_EVENT:
                // event is sent when card is deleted - moved ti done
                MapState<String, Card> doneCardState = getRuntimeContext().getMapState(
                        doneCardsDescriptor
                );
                String idToDelete = event.getData().get(ClockEvent.ID);
                Card cardToDelete = activeCardState.get(idToDelete);
                activeCardState.remove(cardToDelete.getId());
                doneCardState.put(cardToDelete.getId(), cardToDelete);
        }
    }

    /**
     * Generate new key or id. Key consists of 8 hex digits.
     *
     * @return new key or id, that contains 8 hex digits.
     */
    String generate() {
        return String.format("%08x", r.nextInt());
    }
}
