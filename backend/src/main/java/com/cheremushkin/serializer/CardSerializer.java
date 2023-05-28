package com.cheremushkin.serializer;

import com.cheremushkin.data.Card;
import com.esotericsoftware.kryo.Kryo;
import com.esotericsoftware.kryo.Serializer;
import com.esotericsoftware.kryo.io.Input;
import com.esotericsoftware.kryo.io.Output;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class CardSerializer extends Serializer<Card> {

    final static String V1 = "CARD_KRYO_V1_2023-10-01";

    @Override
    public void write(Kryo kryo, Output output, @NonNull Card card) {
        log.info("write card {}", card);
        output.writeString(V1);
        output.writeString(card.getId());
        output.writeString(card.getHeader());
        output.writeString(card.getDescription());
        kryo.writeObjectOrNull(output, card.getX(), Integer.class);
        kryo.writeObjectOrNull(output, card.getY(), Integer.class);
    }

    @Override
    public Card read(Kryo kryo, Input input, Class<Card> type) {
        String version = input.readString();
        String id = input.readString();
        String header = input.readString();
        String description = input.readString();
        Integer x = kryo.readObjectOrNull(input, Integer.class);
        Integer y = kryo.readObjectOrNull(input, Integer.class);
        Card card = new Card(id);
        card.setHeader(header);
        card.setDescription(description);
        card.setX(x);
        card.setY(y);
        log.info("read card {}", card);
        return card;
    }
}
