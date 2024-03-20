package com.cheremushkin.function;

import com.cheremushkin.data.Card;
import com.cheremushkin.data.Session;
import org.apache.flink.api.common.functions.RuntimeContext;
import org.apache.flink.api.common.state.MapState;
import org.apache.flink.api.common.state.MapStateDescriptor;
import org.apache.flink.api.common.state.ValueState;
import org.apache.flink.api.common.state.ValueStateDescriptor;
import org.apache.flink.api.common.typeinfo.TypeInformation;

public class FlinkUserState implements UserState {
    final ValueStateDescriptor<Session> sessionDescriptor =
            new ValueStateDescriptor<>("session", TypeInformation.of(Session.class));
    final MapStateDescriptor<String, Card> activeCardsDescriptor =
            new MapStateDescriptor<>("sessionActiveCards", TypeInformation.of(String.class), TypeInformation.of(Card.class));
    final MapStateDescriptor<String, Card> doneCardsDescriptor =
            new MapStateDescriptor<>("sessionDoneCards", TypeInformation.of(String.class), TypeInformation.of(Card.class));

    final ValueState<Session> sessionState;
    final MapState<String, Card> activeCardState;
    final MapState<String, Card> doneCardState;

    FlinkUserState(RuntimeContext runtimeContext) {
        sessionState = runtimeContext.getState(sessionDescriptor);
        activeCardState = runtimeContext.getMapState(activeCardsDescriptor);
        doneCardState = runtimeContext.getMapState(doneCardsDescriptor);
    }

    @Override
    public ValueState<Session> getSessionState() {
        return sessionState;
    }
    @Override
    public MapState<String, Card> getActiveCardState() {
        return activeCardState;
    }
    @Override
    public MapState<String, Card> getDoneCardState() {
        return doneCardState;
    }
}
