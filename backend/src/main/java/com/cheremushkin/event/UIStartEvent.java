package com.cheremushkin.event;

import lombok.NonNull;

import java.util.Map;

public class UIStartEvent extends ClockEvent {
    public static final String UI_START_EVENT = "UI_START_EVENT";

    public UIStartEvent(@NonNull Long createDate,
                        @NonNull String sessionKey
    ) {
        super(UI_START_EVENT, createDate, sessionKey, Map.of());
    }
}
