package com.cheremushkin.serializer;

import com.cheremushkin.data.WorkEvent;
import com.esotericsoftware.kryo.Kryo;
import com.esotericsoftware.kryo.Serializer;
import com.esotericsoftware.kryo.io.Input;
import com.esotericsoftware.kryo.io.Output;

import java.time.ZonedDateTime;
import java.util.HashMap;
import java.util.Map;

public class WorkEventSerializer extends Serializer<WorkEvent> {
    @Override
    public void write(Kryo kryo, Output output, WorkEvent object) {
        output.writeString(object.getType());
        kryo.writeObject(output, object.getDateTime());
        output.writeInt(object.getData().size());
        object.getData().forEach((key, value) -> {
            output.writeString(key);
            output.writeString(value);
        });
    }

    @Override
    public WorkEvent read(Kryo kryo, Input input, Class type) {
        String t = input.readString();
        ZonedDateTime time = kryo.readObject(input, ZonedDateTime.class);
        Map<String, String> map = new HashMap<>();
        int size = input.readInt();
        for(int i = 0; i < size; i ++) {
            map.put(input.readString(), input.readString());
        }
        return new WorkEvent(t, time, map);
    }
}
