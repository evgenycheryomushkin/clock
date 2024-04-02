package com.cheremushkin.rabbit;

import com.cheremushkin.transport.ClockEnvelope;
import org.apache.flink.streaming.connectors.rabbitmq.RMQDeserializationSchema;

import java.util.ArrayList;
import java.util.List;

public class TestRMQCollector implements RMQDeserializationSchema.RMQCollector<ClockEnvelope> {
    List<ClockEnvelope> envelopeList = new ArrayList<>();
    @Override
    public boolean setMessageIdentifiers(String correlationId, long deliveryTag) {
        return false;
    }

    @Override
    public void collect(ClockEnvelope record) {
        envelopeList.add(record);
    }

    List<ClockEnvelope> getAllEnvelopes() {
        return envelopeList;
    }

    @Override
    public void close() {
    }
}
