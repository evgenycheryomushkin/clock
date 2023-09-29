package com.cheremushkin;

import com.cheremushkin.data.ClockEvent;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.apache.flink.api.common.serialization.SerializationSchema;

@Slf4j
public class RMQSerializer implements SerializationSchema<ClockEvent> {

    ObjectMapper mapper = new ObjectMapper();

    @Override
    public byte[] serialize(ClockEvent element) {
        try {
            return mapper.writeValueAsBytes(element);
        } catch (JsonProcessingException e) {
            log.error("Error serializing result", e);
        }
        return null;
    }
}
