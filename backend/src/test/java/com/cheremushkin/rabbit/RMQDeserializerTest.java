package com.cheremushkin.rabbit;

import com.rabbitmq.client.AMQP;
import org.junit.Test;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Collections;

import static org.junit.Assert.assertEquals;

public class RMQDeserializerTest {
    public static final String REPLY_QUEUE = "reply-queue";
    RMQDeserializer deserializer = new RMQDeserializer();

    String body = "{" +
            "\"type\":\"TEST_TYPE\"," +
            "\"createDate\":123," +
            "\"sessionKey\":\"a1234567\"," +
            "\"data\":{}" +
            "}";

    @Test
    public void deserializeUIStartEvent() throws IOException {
        TestRMQCollector collector = new TestRMQCollector();
        AMQP.BasicProperties properties = new AMQP.BasicProperties(
                null, null, null, null, null, null, REPLY_QUEUE, null, null, null, null, null, null, null
        );
        deserializer.deserialize(null, properties, body.getBytes(StandardCharsets.UTF_8), collector);
        assertEquals(1, collector.getAllEnvelopes().size());
        assertEquals(REPLY_QUEUE, collector.getAllEnvelopes().get(0).getReplyTo());
        assertEquals("TEST_TYPE", collector.getAllEnvelopes().get(0).getClockEvent().getType());
        assertEquals(Long.valueOf(123), collector.getAllEnvelopes().get(0).getClockEvent().getCreateDate());
        assertEquals("a1234567", collector.getAllEnvelopes().get(0).getClockEvent().getSessionKey());
        assertEquals(Collections.emptyMap(), collector.getAllEnvelopes().get(0).getClockEvent().getData());
    }
}