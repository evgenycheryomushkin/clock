package com.cheremushkin;

import com.cheremushkin.data.WorkEvent;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.apache.flink.api.common.serialization.DeserializationSchema;
import org.apache.flink.api.common.typeinfo.TypeInformation;
import org.apache.flink.streaming.connectors.kafka.KafkaDeserializationSchema;
import org.apache.kafka.clients.consumer.ConsumerRecord;

public class WorkTaskKafkaDeserializer implements KafkaDeserializationSchema<WorkEvent> {

    ObjectMapper objectMapper;

    @Override
    public void open(DeserializationSchema.InitializationContext context) throws Exception {
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
    }

    @Override
    public boolean isEndOfStream(WorkEvent nextElement) {
        return false;
    }

    @Override
    public WorkEvent deserialize(ConsumerRecord<byte[], byte[]> record) throws Exception {
        WorkEvent workEvent = objectMapper.readValue(record.value(), WorkEvent.class);
        return workEvent;
    }

    @Override
    public TypeInformation<WorkEvent> getProducedType() {
        return TypeInformation.of(WorkEvent.class);
    }
}
