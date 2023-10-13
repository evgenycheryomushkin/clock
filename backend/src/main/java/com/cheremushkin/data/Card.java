package com.cheremushkin.data;

import com.cheremushkin.serializer.CardSerializer;
import com.esotericsoftware.kryo.DefaultSerializer;
import lombok.*;

@Getter
@Setter
@ToString
@DefaultSerializer(CardSerializer.class)
public class Card {
    String id;
    String header;
    String description;
    Integer x;
    Integer y;
    public Card(@NonNull String id) {
        this.id = id;
    }
}
