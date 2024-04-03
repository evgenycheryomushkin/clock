package com.cheremushkin.mapper;

import com.cheremushkin.data.Card;
import com.cheremushkin.event.ClockEvent;

import java.util.Map;


public class FrontendCardMapper {
    public static final String ID = "ID";
    public static final String CARD_HEADER      = "CARD_HEADER";
    public static final String CARD_DESCRIPTION = "CARD_DESCRIPTION";
    public static final String CARD_X           = "CARD_X";
    public static final String CARD_Y           = "CARD_Y";

    public static final String ERROR_EVENT_TYPE = "ERROR_EVENT";
    public static final String ERROR_DESCRIPTION = "ERROR_DESCRIPTION";
    public static final String BACKEND_NEW_ID_EVENT = "BACKEND_NEW_ID_EVENT";
    public static final String BACKEND_UPDATE_SUCCESS = "BACKEND_UPDATE_SUCCESS";
    public static final String EMIT_CARD = "EMIT_CARD";


    public static ClockEvent mapCardToEvent(Card card, String sessionKey) {
        return ClockEvent.build(EMIT_CARD, sessionKey)
                .add(ID, card.getId())
                .add(CARD_HEADER, card.getHeader())
                .add(CARD_DESCRIPTION, card.getDescription())
                .add(CARD_X, String.valueOf(card.getX()))
                .add(CARD_Y, String.valueOf(card.getY()));
    }

    public static Card mapEventToCard(ClockEvent event) {
        Map<String, String> eventData = event.getData();
        String id = eventData.get(ID);
        Card card = Card.build(id);
        card.setHeader(eventData.get(CARD_HEADER));
        card.setDescription(eventData.get(CARD_DESCRIPTION));
        if (eventData.get(CARD_X) != null) card.setX(Integer.valueOf(eventData.get(CARD_X)));
        if (eventData.get(CARD_Y) != null) card.setY(Integer.valueOf(eventData.get(CARD_Y)));
        return card;
    }
}
