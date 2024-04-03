package com.cheremushkin.rabbit;

import com.cheremushkin.event.UIStartEvent;
import com.cheremushkin.mapper.FrontendCardMapper;
import com.cheremushkin.processor.main.CardProcessor;
import com.rabbitmq.client.AMQP;
import lombok.NonNull;
import org.junit.Before;
import org.junit.Test;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.Map;

import static org.junit.Assert.assertEquals;

public class RMQDeserializerTest {

    static final String REPLY_QUEUE = "reply-queue";
    final static String UI_START_EVENT_BODY = buildUIStartBody();
    final static String CARD_UPDATE_EVENT_BODY = buildUpdateBody();
    final static AMQP.BasicProperties AMQP_PROPERTIES = buildAMQPProperties();

    RMQDeserializer deserializer;
    TestRMQCollector collector;

    @Before
    public void beforeEachTest() {
        deserializer = new RMQDeserializer();
        collector = new TestRMQCollector();
    }

    @Test
    public void test_should_deserialize_UIStartEvent() throws IOException {
        deserializer.deserialize(
                null, AMQP_PROPERTIES,
                UI_START_EVENT_BODY.getBytes(StandardCharsets.UTF_8), collector
        );
        assertEquals(1, collector.getAllEnvelopes().size());
        assertEquals(REPLY_QUEUE, collector.getAllEnvelopes().get(0).getReplyTo());
        assertEquals(UIStartEvent.UI_START_EVENT, collector.getAllEnvelopes().get(0).getClockEvent().getType());
        assertEquals(Long.valueOf(123), collector.getAllEnvelopes().get(0).getClockEvent().getCreateDate());
        assertEquals("a1234567", collector.getAllEnvelopes().get(0).getClockEvent().getSessionKey());
        assertEquals(Collections.emptyMap(), collector.getAllEnvelopes().get(0).getClockEvent().getData());
    }

    @Test
    public void test_should_deserialize_UpdateCardEvent() throws IOException {
        deserializer.deserialize(
                null, AMQP_PROPERTIES,
                CARD_UPDATE_EVENT_BODY.getBytes(StandardCharsets.UTF_8), collector
        );
        assertEquals(1, collector.getAllEnvelopes().size());
        assertEquals(REPLY_QUEUE, collector.getAllEnvelopes().get(0).getReplyTo());
        assertEquals(CardProcessor.UPDATE_CARD_EVENT, collector.getAllEnvelopes().get(0).getClockEvent().getType());
        assertEquals(Long.valueOf(123), collector.getAllEnvelopes().get(0).getClockEvent().getCreateDate());
        assertEquals("a1234567", collector.getAllEnvelopes().get(0).getClockEvent().getSessionKey());
        assertEquals(Map.of(
                FrontendCardMapper.ID, "12345678",
                FrontendCardMapper.CARD_HEADER, "base64header",
                FrontendCardMapper.CARD_DESCRIPTION, "base64description",
                FrontendCardMapper.CARD_X, "101",
                FrontendCardMapper.CARD_Y, "202"
        ), collector.getAllEnvelopes().get(0).getClockEvent().getData());
    }

    @NonNull
    private static String buildUIStartBody() {
        return "{" +
                  "\"type\":\"" + UIStartEvent.UI_START_EVENT + "\"," +
                  "\"createDate\":123," +
                  "\"sessionKey\":\"a1234567\"," +
                  "\"data\":{}" +
               "}";
    }

    @NonNull
    private static String buildUpdateBody() {
        return "{" +
                  "\"type\":\""+ CardProcessor.UPDATE_CARD_EVENT+"\"," +
                  "\"createDate\":123," +
                  "\"sessionKey\":\"a1234567\"," +
                  "\"data\":{" +
                        "\"CARD_X\":\"101\", \"CARD_Y\":\"202\", \"ID\":\"12345678\", " +
                        "\"CARD_DESCRIPTION\":\"base64description\", \"CARD_HEADER\":\"base64header\"" +
                  "}" +
               "}";
    }

    @NonNull
    private static AMQP.BasicProperties buildAMQPProperties() {
        return new AMQP.BasicProperties(
                null,
                null,
                null,
                null,
                null,
                null,
                REPLY_QUEUE,
                null,
                null,
                null,
                null,
                null,
                null,
                null
        );
    }
}