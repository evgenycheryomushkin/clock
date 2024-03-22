package com.cheremushkin.data;

import com.cheremushkin.serializer.CardSerializer;
import com.esotericsoftware.kryo.DefaultSerializer;
import lombok.*;

@Getter
@Setter
@ToString
@DefaultSerializer(CardSerializer.class)
public class Card implements Cloneable {
    @NonNull String id;
    String header;
    String description;
    Integer x;
    Integer y;
    private Card(@NonNull String id) {
        this.id = id;
    }
    public static Card build(@NonNull String id) {
        return new Card(id);
    }

    @Override
    public Card clone() {
        return new Card(this);
    }

    private Card(Card card) {
        this.id = card.id;
        this.header = card.header;
        this.description = card.description;
        this.x = card.x;
        this.y = card.y;
    }
}
