package com.cheremushkin.serializer;

import com.cheremushkin.data.KeyInfo;
import com.esotericsoftware.kryo.Kryo;
import com.esotericsoftware.kryo.Serializer;
import com.esotericsoftware.kryo.io.Input;
import com.esotericsoftware.kryo.io.Output;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class KeyInfoSerializer extends Serializer<KeyInfo> {
    final static String V1 = "KEY_INFO_KRYO_V1_2023-10-01";

    @Override
    public void write(Kryo kryo, Output output, KeyInfo keyInfo) {
        output.writeString(V1);
        output.writeLong(keyInfo.getCreated());
        output.writeLong(keyInfo.getUpdated());
    }

    @Override
    public KeyInfo read(Kryo kryo, Input input, Class<KeyInfo> type) {
        String version = input.readString();
        Long created = input.readLong();
        Long updated = input.readLong();
        KeyInfo keyInfo = new KeyInfo();
        keyInfo.setCreated(created);
        keyInfo.setUpdated(updated);
        return keyInfo;
    }
}
