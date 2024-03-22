package com.cheremushkin.mapper;

import com.cheremushkin.data.Card;
import com.cheremushkin.transport.ClockEvent;
import org.junit.Test;

import static com.cheremushkin.mapper.FrontendCardMapper.CARD_DESCRIPTION;
import static com.cheremushkin.mapper.FrontendCardMapper.CARD_HEADER;
import static com.cheremushkin.mapper.FrontendCardMapper.CARD_X;
import static com.cheremushkin.mapper.FrontendCardMapper.CARD_Y;
import static com.cheremushkin.mapper.FrontendCardMapper.EMIT_CARD;
import static com.cheremushkin.mapper.FrontendCardMapper.ID;
import static org.junit.Assert.*;

public class FrontendCardMapperTest {

    @Test
    public void mapCardToEvent() {
        Card card = Card.build("12345678");
        card.setHeader("test");
        card.setDescription("test_description");
        card.setX(1);
        card.setY(2);
        ClockEvent event = FrontendCardMapper.mapCardToEvent(card, "a1234567");
        assertEquals("a1234567", event.getSessionKey());
        assertEquals("test", event.get(CARD_HEADER));
        assertEquals("test_description", event.get(CARD_DESCRIPTION));
        assertEquals("1", event.get(CARD_X));
        assertEquals("2", event.get(CARD_Y));
    }

    @Test
    public void mapEventToCard() {
        ClockEvent event = ClockEvent.build(EMIT_CARD, "a1234567")
                .add(ID, "12345678")
                .add(CARD_HEADER, "header")
                .add(CARD_DESCRIPTION, "description")
                .add(CARD_X, "1")
                .add(CARD_Y, "2");
        Card card = FrontendCardMapper.mapEventToCard(event);
        assertEquals("12345678", card.getId());
        assertEquals("header", card.getHeader());
        assertEquals("description", card.getDescription());
        assertEquals(Integer.valueOf(1), card.getX());
        assertEquals(Integer.valueOf(2), card.getY());
    }
}