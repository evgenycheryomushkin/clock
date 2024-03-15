package com.cheremushkin.serializer;

import com.cheremushkin.data.ClockEnvelope;
import com.cheremushkin.data.ClockEvent;
import com.esotericsoftware.kryo.Kryo;
import com.esotericsoftware.kryo.Serializer;
import com.esotericsoftware.kryo.io.Input;
import com.esotericsoftware.kryo.io.Output;

public class ClockEnvelopeSerializer extends Serializer<ClockEnvelope> {
    final static String V1 = "CLOCK_ENVELOPE_KRYO_V1_2023-11-07";

    @Override
    public void write(Kryo kryo, Output output, ClockEnvelope object) {
        output.writeString(V1);
        output.writeString(object.getReplyTo());
        kryo.writeObject(output, object.getClockEvent());
    }

    @Override
    public ClockEnvelope read(Kryo kryo, Input input, Class<ClockEnvelope> type) {
        String version = input.readString();
        String replyTo = input.readString();
        ClockEvent clockEvent = kryo.readObject(input, ClockEvent.class);
        return new ClockEnvelope(replyTo, clockEvent);
    }
}
