package com.cheremushkin.data;

import com.cheremushkin.serializer.ClockEnvelopeSerializer;
import com.esotericsoftware.kryo.DefaultSerializer;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NonNull;
import lombok.ToString;

@Getter
@AllArgsConstructor
@ToString
@DefaultSerializer(ClockEnvelopeSerializer.class)
public class ClockEnvelope {
    @NonNull
    String replyTo;

    @NonNull
    ClockEvent clockEvent;
}
