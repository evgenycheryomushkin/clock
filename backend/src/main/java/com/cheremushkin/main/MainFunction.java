package com.cheremushkin.main;

import com.cheremushkin.Util;
import com.cheremushkin.data.Card;
import com.cheremushkin.data.WorkEvent;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.flink.api.common.functions.RichFlatMapFunction;
import org.apache.flink.api.common.state.MapState;
import org.apache.flink.api.common.state.MapStateDescriptor;
import org.apache.flink.api.common.state.ValueState;
import org.apache.flink.api.common.state.ValueStateDescriptor;
import org.apache.flink.api.common.typeinfo.TypeInformation;
import org.apache.flink.util.Collector;

public class MainFunction extends RichFlatMapFunction<WorkEvent, WorkEvent> {

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
    public void flatMap(WorkEvent event, Collector<WorkEvent> out) throws Exception {
        ValueState<Session> sessionState = getRuntimeContext().getState(sessionDescriptor);
        MapState<String, Card> activeCardState = getRuntimeContext().getMapState(
                activeCardsDescriptor
        );
        switch (event.getType()) {
            case WorkEvent.UI_START_WITHOUT_KEY_EVENT:
                // This session is new. We should create new value for session.
                // and return key inside event (BACKEND_NEW_KEY_EVENT
                Session session = Session.builder().build();
                sessionState.update(session);
                out.collect(
                        WorkEvent.builder()
                                .type(WorkEvent.BACKEND_NEW_KEY_EVENT)
                                .build()
                                .add(WorkEvent.SESSION_KEY, event.getData().get(WorkEvent.SESSION_KEY))
                );
                return;
            case WorkEvent.CARD_GET_ID_EVENT:
                // Event is processed when new card is created and id is generated. This id is sent
                // back to UI
                String id = Util.generate();
                activeCardState.put(id, Card.builder().id(id).build());
                out.collect(WorkEvent.builder().type(WorkEvent.BACKEND_NEW_ID_EVENT).build().add(WorkEvent.ID, id));
                return;
            case WorkEvent.UPDATE_CARD_EVENT:
                // event is sent when card is updated
                Card card = objectMapper.readValue(event.getData().get(WorkEvent.CARD), Card.class);
                activeCardState.put(card.getId(), card);
                return;
            case WorkEvent.DELETE_CARD_EVENT:
                // event is sent when card is deleted - moved ti done
                MapState<String, Card> doneCardState = getRuntimeContext().getMapState(
                        doneCardsDescriptor
                );
                String idToDelete = event.getData().get(WorkEvent.ID);
                Card cardToDelete = activeCardState.get(idToDelete);
                activeCardState.remove(cardToDelete.getId());
                doneCardState.put(cardToDelete.getId(), cardToDelete);
        }
    }
}
