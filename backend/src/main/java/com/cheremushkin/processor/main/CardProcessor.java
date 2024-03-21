package com.cheremushkin.processor.main;

import com.cheremushkin.data.Card;
import com.cheremushkin.data.ClockEvent;
import com.cheremushkin.function.UserState;
import com.cheremushkin.mapper.FrontendCardMapper;
import com.cheremushkin.processor.EventProcessor;
import lombok.NonNull;

import java.util.Collections;
import java.util.List;
import java.util.Random;

import static com.cheremushkin.mapper.FrontendCardMapper.BACKEND_NEW_ID_EVENT;
import static com.cheremushkin.mapper.FrontendCardMapper.BACKEND_UPDATE_SUCCESS;
import static com.cheremushkin.mapper.FrontendCardMapper.ID;


public class CardProcessor implements EventProcessor {
    public static final String CARD_GET_ID_EVENT = "CARD_GET_ID_EVENT";
    public static final String UPDATE_CARD_EVENT = "UPDATE_CARD_EVENT";
    public static final String DONE_CARD_EVENT = "DONE_CARD_EVENT";

    final UserState state;
    public CardProcessor(UserState state) {
        this.state = state;
    }

    @Override
    public @NonNull List<String> getApplicableEventTypes() {
        return List.of(CARD_GET_ID_EVENT, UPDATE_CARD_EVENT, DONE_CARD_EVENT);
    }

    @Override
    public @NonNull List<ClockEvent> process(@NonNull ClockEvent event) throws Exception {
        if (CARD_GET_ID_EVENT.equals(event.getType())) {
            String id = generate(state);
            state.getActiveCardState().put(id, new Card(id));
            return List.of(
                    new ClockEvent(BACKEND_NEW_ID_EVENT).add(ID, id)
                            .addSessionKey(event.getSessionKey()));
        }
        if (UPDATE_CARD_EVENT.equals(event.getType())) {
            Card card = FrontendCardMapper.mapEventToCard(event);
            String id = card.getId();
            Card cardFromState = state.getActiveCardState().get(id);
            Card cardToState = updateNonEmptyFields(cardFromState, card);
            state.getActiveCardState().put(id, cardToState);
            return List.of(new ClockEvent(BACKEND_UPDATE_SUCCESS).add(ID, id)
                    .addSessionKey(event.getSessionKey()));
        }
        if (DONE_CARD_EVENT.equals(event.getType())) {
            String id = event.getData().get(ID);
            Card cardToDelete = state.getActiveCardState().get(id);
            if (cardToDelete != null) {
                state.getActiveCardState().remove(cardToDelete.getId());
                state.getDoneCardState().put(cardToDelete.getId(), cardToDelete);
                return List.of(new ClockEvent(BACKEND_UPDATE_SUCCESS).add(ID, id)
                        .addSessionKey(event.getSessionKey()));
            }
        }
        return Collections.emptyList();
    }

    private Card updateNonEmptyFields(Card cardFromState, Card card) {
        Card newCard = new Card(cardFromState);
        if (card.getHeader() != null) newCard.setHeader(card.getHeader());
        if (card.getDescription() != null) newCard.setDescription(card.getDescription());
        if (card.getX()!= null) newCard.setX(card.getX());
        if (card.getY() != null) newCard.setY(card.getY());
        return newCard;
    }

    Random generator = new Random();
    String generate(UserState state) throws Exception {
        String newKey = null;
        while (newKey == null || state.getActiveCardState().contains(newKey) ||
                state.getDoneCardState().contains(newKey)) {
            newKey = String.format("%08x", generator.nextInt());
        }
        return newKey;
    }
}
