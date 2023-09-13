package com.cheremushkin;

import com.cheremushkin.data.WorkEvent;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.flink.api.common.serialization.SerializationSchema;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class WorkTaskKafkaSerializer implements SerializationSchema<WorkEvent> {
    Logger log = LoggerFactory.getLogger(WorkTaskKafkaSerializer.class);
    ObjectMapper mapper = new ObjectMapper();

    @Override
    public byte[] serialize(WorkEvent value) {
        try {
            return mapper.writeValueAsBytes(value);
        } catch (JsonProcessingException e) {
            log.error("Json serialization error", e);
        }
        return null;
    }
}
