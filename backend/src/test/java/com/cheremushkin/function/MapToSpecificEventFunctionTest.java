package com.cheremushkin.function;

import com.cheremushkin.event.UIStartEvent;
import com.cheremushkin.transport.ClockEnvelope;
import com.cheremushkin.event.ClockEvent;
import lombok.NonNull;
import org.junit.Before;
import org.junit.Test;

import java.util.Map;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

public class MapToSpecificEventFunctionTest {

    static final ClockEvent UI_START_INPUT_EVENT_WITH_SESSION_KEY = buildUIStartInputEventSessionKey();
    static final String REPLY_TO_QUEUE = "reply-queue-123";

    MapToSpecificEventFunction mapToSpecificEventFunction;

    @Before
    public void beforeEachTest() {
        mapToSpecificEventFunction = new MapToSpecificEventFunction();
    }

    @Test
    public void test_should_map_ClockEvent_with_session_to_UIStartEvent() throws Exception {
        ClockEnvelope envelope = new ClockEnvelope(REPLY_TO_QUEUE,
                UI_START_INPUT_EVENT_WITH_SESSION_KEY
        );
        final ClockEnvelope outputEnvelope = mapToSpecificEventFunction.map(envelope);
        final ClockEvent clockEvent = outputEnvelope.getClockEvent();
        assertNotNull(clockEvent);
        // TODO assertTrue(clockEvent instanceof )
    }

    @Test
    public void test_should_map_ClockEvent_without_session_to_UIStartEvent() {
    }

    private static ClockEvent buildUIStartInputEventSessionKey() {
        @NonNull Map<String, String> data = Map.of();
        return new ClockEvent(UIStartEvent.UI_START_EVENT, 123L, "a1234567", data);
    }

}