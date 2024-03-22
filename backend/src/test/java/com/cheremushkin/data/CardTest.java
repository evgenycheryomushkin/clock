package com.cheremushkin.data;

import org.junit.Test;

import static org.junit.Assert.*;

public class CardTest {

    @Test
    public void build() {
        Card card = Card.build("12345678");
        assertEquals("12345678", card.id);
    }

    @Test
    public void testClone() {
        Card card = Card.build("12345678");
        card.setHeader("test");
        card.setDescription("test_description");
        card.setX(1);
        card.setY(2);
        Card cloned = card.clone();
        assertEquals("test", cloned.header);
        assertEquals("test_description", cloned.description);
        assertEquals(Integer.valueOf(1), card.x);
        assertEquals(Integer.valueOf(2), card.y);
    }
}