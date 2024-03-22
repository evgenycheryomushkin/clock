package com.cheremushkin.processor.main;

import com.cheremushkin.data.Card;
import com.cheremushkin.transport.ClockEvent;
import com.cheremushkin.data.Session;
import com.cheremushkin.state.FlinkUserState;
import com.cheremushkin.state.UserState;
import com.cheremushkin.mapper.FrontendCardMapper;
import com.cheremushkin.processor.EventProcessor;
import lombok.NonNull;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

public class UIStartEventProcessor implements EventProcessor {
    final FlinkUserState state;
    public static final String UI_START_WITHOUT_KEY_EVENT = "UI_START_WITHOUT_KEY_EVENT";
    public static final String UI_START_WITH_KEY_EVENT = "UI_START_WITH_KEY_EVENT";
    public static final String BACKEND_NEW_KEY_EVENT = "BACKEND_NEW_KEY_EVENT";
    public static final String BACKEND_EXISTING_KEY_EVENT = "BACKEND_EXISTING_KEY_EVENT";


    UIStartEventProcessor(FlinkUserState state) {
        this.state = state;
    }

    @Override
    public @NonNull List<String> getApplicableEventTypes() {
        return List.of(UI_START_WITHOUT_KEY_EVENT, UI_START_WITH_KEY_EVENT);
    }

    @Override
    public @NonNull List<ClockEvent> process(@NonNull ClockEvent event) throws Exception {
        if (UI_START_WITHOUT_KEY_EVENT.equals(event.getType())) {
            return processUIStartWithoutKey(state, event);
        }
        if (UI_START_WITH_KEY_EVENT.equals(event.getType())) {
            return processUIStartWithKey(state, event);
        }
        return Collections.emptyList();
    }

    private List<ClockEvent> processUIStartWithoutKey(UserState state, ClockEvent event) throws IOException {
        String sessionKey = event.getSessionKey();
        Session session = new Session(sessionKey);
        state.getSessionState().update(session);
        ClockEvent newEvent = ClockEvent.build(BACKEND_NEW_KEY_EVENT, sessionKey);
        return List.of(newEvent);
    }

    private List<ClockEvent> processUIStartWithKey(UserState state, ClockEvent event) throws Exception {
        List<ClockEvent> resultList = new ArrayList<>();
        String sessionKey = event.getSessionKey();
        ClockEvent existingKeyEvent = ClockEvent.build(BACKEND_EXISTING_KEY_EVENT, sessionKey);

        resultList.add(existingKeyEvent);

        List<ClockEvent> cardsList = getCardsListFromState(state, sessionKey);
        resultList.addAll(cardsList);

        return resultList;
    }

    private List<ClockEvent> getCardsListFromState(UserState state, final String sessionKey) throws Exception {
        Iterable<Card> allCardsForUser = state.getActiveCardState().values();
        return StreamSupport.stream(allCardsForUser.spliterator(), false)
                .map(card -> FrontendCardMapper.mapCardToEvent(card, sessionKey))
                .collect(Collectors.toList());
    }
}
