package com.cheremushkin;

import com.cheremushkin.data.ClockEvent;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rabbitmq.client.AMQP;
import com.rabbitmq.client.Envelope;
import org.apache.flink.api.common.typeinfo.TypeHint;
import org.apache.flink.api.common.typeinfo.TypeInformation;
import org.apache.flink.streaming.connectors.rabbitmq.RMQDeserializationSchema;

import java.io.IOException;

public class RMQDeserializer implements RMQDeserializationSchema<ClockEvent> {
    ObjectMapper mapper = new ObjectMapper();

    @Override
    public void deserialize(Envelope envelope, AMQP.BasicProperties properties, byte[] body, RMQCollector<ClockEvent> collector) throws IOException {
        collector.collect(mapper.readValue(body, ClockEvent.class));
    }

    @Override
    public boolean isEndOfStream(ClockEvent nextElement) {
        return false;
    }

    @Override
    public TypeInformation<ClockEvent> getProducedType() {
        return TypeInformation.of(ClockEvent.class);
    }
}
