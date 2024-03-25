package com.cheremushkin.processor.main;

import com.cheremushkin.data.Card;
import com.cheremushkin.data.Session;
import com.cheremushkin.state.UserState;
import org.apache.flink.api.common.state.MapState;
import org.apache.flink.api.common.state.ValueState;

public class TestCardUserState implements UserState {

    TestValueState<Session> sessionState = new TestValueState<>();
    TestMapState<String, Card> activeCardsState = new TestMapState<>();
    TestMapState<String, Card> doneCardsState = new TestMapState<>();

    @Override
    public ValueState<Session> getSessionState() {
        return sessionState;
    }

    @Override
    public MapState<String, Card> getActiveCardState() {
        return activeCardsState;
    }

    @Override
    public MapState<String, Card> getDoneCardState() {
        return doneCardsState;
    }
}
