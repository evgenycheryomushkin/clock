package com.cheremushkin.serializer;

import com.cheremushkin.data.Card;
import com.esotericsoftware.kryo.Kryo;
import com.esotericsoftware.kryo.Serializer;
import com.esotericsoftware.kryo.io.Input;
import com.esotericsoftware.kryo.io.Output;

public class CardSerializer extends Serializer<Card> {

    final static String V1 = "KRYO_CARD_V1_2023-10-01";

    @Override
    public void write(Kryo kryo, Output output, Card card) {
        output.writeString(V1);
        output.writeString(card.getId());
        output.writeString(card.getHeader());
        output.writeString(card.getDescription());
        output.writeInt(card.getX());
        output.writeInt(card.getY());
    }

    @Override
    public Card read(Kryo kryo, Input input, Class<Card> type) {
        String version = input.readString();
        String id = input.readString();
        String header = input.readString();
        String description = input.readString();
        Integer x = input.readInt();
        Integer y = input.readInt();
        Card card = new Card(id);
        card.setHeader(header);
        card.setDescription(description);
        card.setX(x);
        card.setY(y);
        return card;
    }
}
