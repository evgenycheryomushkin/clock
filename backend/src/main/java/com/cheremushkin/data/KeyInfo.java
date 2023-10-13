package com.cheremushkin.data;

import com.cheremushkin.serializer.KeyInfoSerializer;
import com.esotericsoftware.kryo.DefaultSerializer;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.ZonedDateTime;


@Getter
@Setter
@DefaultSerializer(KeyInfoSerializer.class)
public class KeyInfo {
    public KeyInfo() {
        created = System.currentTimeMillis();
        updated = created;
    }
    Long created;
    Long updated;
}
