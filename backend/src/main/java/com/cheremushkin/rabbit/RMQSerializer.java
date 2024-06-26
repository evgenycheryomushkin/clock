package com.cheremushkin.rabbit;

import com.cheremushkin.transport.ClockEnvelope;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.apache.flink.api.common.serialization.SerializationSchema;

@Slf4j
public class RMQSerializer implements SerializationSchema<ClockEnvelope> {

    ObjectMapper mapper = new ObjectMapper();

    @Override
    public byte[] serialize(ClockEnvelope element) {
        try {
            return mapper.writeValueAsBytes(element.getClockEvent());
        } catch (JsonProcessingException e) {
            log.error("Error serializing result", e);
        }
        return null;
    }
}
