package com.cheremushkin.rabbit;

import com.cheremushkin.transport.ClockEnvelope;
import com.cheremushkin.transport.ClockEvent;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rabbitmq.client.AMQP;
import com.rabbitmq.client.Envelope;
import org.apache.flink.api.common.typeinfo.TypeInformation;
import org.apache.flink.streaming.connectors.rabbitmq.RMQDeserializationSchema;

import java.io.IOException;

public class RMQDeserializer implements RMQDeserializationSchema<ClockEnvelope> {
    ObjectMapper mapper = new ObjectMapper();

    @Override
    public void deserialize(Envelope envelope, AMQP.BasicProperties properties, byte[] body, RMQCollector<ClockEnvelope> collector) throws IOException {
        ClockEvent clockEvent = mapper.readValue(body, ClockEvent.class);
        ClockEnvelope clockEnvelope = new ClockEnvelope(
                properties.getReplyTo(), clockEvent
        );
        collector.collect(clockEnvelope);
    }

    @Override
    public boolean isEndOfStream(ClockEnvelope nextElement) {
        return false;
    }

    @Override
    public TypeInformation<ClockEnvelope> getProducedType() {
        return TypeInformation.of(ClockEnvelope.class);
    }
}
