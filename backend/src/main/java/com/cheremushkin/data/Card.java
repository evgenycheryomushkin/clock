package com.cheremushkin.data;

import com.cheremushkin.serializer.CardSerializer;
import com.esotericsoftware.kryo.DefaultSerializer;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;

@Getter
@Setter
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
