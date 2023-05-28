package com.cheremushkin.data;

import com.cheremushkin.serializer.WorkEventSerializer;
import com.esotericsoftware.kryo.DefaultSerializer;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.extern.jackson.Jacksonized;

import java.time.ZonedDateTime;
import java.util.Map;

@Data
@Builder
@Jacksonized
@AllArgsConstructor
@DefaultSerializer(WorkEventSerializer.class)
final public class WorkEvent {
    String type;
    ZonedDateTime dateTime;
    Map<String, String> data;
}
