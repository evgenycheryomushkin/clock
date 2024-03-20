package com.cheremushkin.function;

import com.cheremushkin.data.Card;
import com.cheremushkin.data.Session;
import org.apache.flink.api.common.state.MapState;
import org.apache.flink.api.common.state.ValueState;

public interface UserState {
    ValueState<Session> getSessionState();
    MapState<String, Card> getActiveCardState();
    MapState<String, Card> getDoneCardState();
}
