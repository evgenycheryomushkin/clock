package com.cheremushkin.serializer;

import com.cheremushkin.data.ClockEvent;
import com.esotericsoftware.kryo.Kryo;
import com.esotericsoftware.kryo.Serializer;
import com.esotericsoftware.kryo.io.Input;
import com.esotericsoftware.kryo.io.Output;

import java.time.ZonedDateTime;
import java.util.HashMap;
import java.util.Map;

public class ClockSerializer extends Serializer<ClockEvent> {
    @Override
    public void write(Kryo kryo, Output output, ClockEvent object) {
        output.writeString(object.getType());
        output.writeLong(object.getCreateDate());
        output.writeString(object.getSessionKey());
        output.writeInt(object.getData().size());
        object.getData().forEach((key, value) -> {
            output.writeString(key);
            output.writeString(value);
        });
    }

    @Override
    public ClockEvent read(Kryo kryo, Input input, Class type) {
        String t = input.readString();
        Long time = input.readLong();
        String key = input.readString();
        Map<String, String> map = new HashMap<>();
        int size = input.readInt();
        for(int i = 0; i < size; i ++) {
            map.put(input.readString(), input.readString());
        }
        return new ClockEvent(t, time, key, map);
    }
}
