package com.cheremushkin.event;

import com.cheremushkin.event.ClockEvent;
import com.cheremushkin.exception.ClockEventException;
import org.junit.Test;

import java.util.Map;

import static com.cheremushkin.mapper.FrontendCardMapper.ERROR_DESCRIPTION;
import static com.cheremushkin.mapper.FrontendCardMapper.ERROR_EVENT_TYPE;
import static org.junit.Assert.*;

public class ClockEventTest {

    static final String TEST_EVENT_TYPE = "TEST_EVENT_TYPE";

    @Test(expected = ClockEventException.class)
    public void test_should_throw_exception_on_wrong_create_date() throws ClockEventException {
        new ClockEvent(TEST_EVENT_TYPE, 123L, "a1234567", Map.of());
    }

    @Test
    public void test_should_create_clock_event_with_good_create_date() throws ClockEventException {
        new ClockEvent(TEST_EVENT_TYPE, System.currentTimeMillis(), "a1234567", Map.of());
    }

    @Test
    public void buildErrorEvent() {
        ClockEvent event = ClockEvent.buildErrorEvent("a1234567");
        assertEquals(ERROR_EVENT_TYPE, event.type);
        assertEquals("a1234567", event.sessionKey);
    }

    @Test
    public void add() {
        ClockEvent event = ClockEvent.buildErrorEvent("a1234567").add(ERROR_DESCRIPTION, "test");
        assertEquals("test", event.get(ERROR_DESCRIPTION));
        assertEquals("a1234567", event.sessionKey);
        ClockEvent event2 = ClockEvent.build("TEST_TYPE","a1234567").add("TEST_KEY", "test value");
        assertNotNull(event2);
        assertEquals("a1234567", event2.sessionKey);
        assertEquals("TEST_TYPE", event2.type);
        assertNotNull(event2.get("TEST_KEY"));
        assertEquals("test value", event2.get("TEST_KEY"));
    }

    @Test
    public void addSessionKey() {
        ClockEvent event2 = ClockEvent.build("TEST_TYPE", "12345678").add("TEST_KEY", "test value");
        assertNotNull(event2);
        assertEquals("12345678", event2.sessionKey);
    }
}