package com.cheremushkin.data;

import com.cheremushkin.serializer.KeyInfoSerializer;
import com.esotericsoftware.kryo.DefaultSerializer;
import lombok.*;

import java.time.ZonedDateTime;


@Getter
@Setter
@ToString
@DefaultSerializer(KeyInfoSerializer.class)
public class KeyInfo {
    Long created;
    Long updated;
    public KeyInfo() {
        created = System.currentTimeMillis();
        updated = created;
    }
}
