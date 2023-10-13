package com.cheremushkin.serializer;

import com.cheremushkin.data.KeyInfo;
import com.esotericsoftware.kryo.Kryo;
import com.esotericsoftware.kryo.Serializer;
import com.esotericsoftware.kryo.io.Input;
import com.esotericsoftware.kryo.io.Output;

public class KeyInfoSerializer extends Serializer<KeyInfo> {
    final static String V1 = "KRYO_CLOCK_V1_2023-10-01";
    @Override
    public void write(Kryo kryo, Output output, KeyInfo object) {

    }

    @Override
    public KeyInfo read(Kryo kryo, Input input, Class<KeyInfo> type) {
        return null;
    }
}
