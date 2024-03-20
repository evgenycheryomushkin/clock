package com.cheremushkin.processor.validate;

import com.cheremushkin.data.ClockEnvelope;
import com.cheremushkin.data.ClockEvent;
import com.cheremushkin.data.KeyInfo;
import com.cheremushkin.processor.EventProcessor;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.apache.flink.api.common.state.MapState;

import java.util.List;
import java.util.Random;

import static com.cheremushkin.mapper.FrontendCardMapper.ERROR_DESCRIPTION;
import static com.cheremushkin.processor.main.UIStartEventProcessor.UI_START_WITHOUT_KEY_EVENT;
import static com.cheremushkin.processor.main.UIStartEventProcessor.UI_START_WITH_KEY_EVENT;

@Slf4j
public class ValidateEventProcessor {
    public static final String UI_START_EVENT = "UI_START_EVENT";

    final MapState<String, KeyInfo> state;

    public ValidateEventProcessor(MapState<String, KeyInfo> state) {
        this.state = state;
    }


    public @NonNull ClockEvent process(ClockEvent event) throws Exception {
        if (UI_START_EVENT.equals(event.getType()))
            return processUIStartEvent(event);
        else return validateSessionFromEvent(event);
    }

    private ClockEvent processUIStartEvent(ClockEvent event) throws Exception {
        if (event.getSessionKey() == null || event.getSessionKey().isEmpty()) {
            return generateNewSession();
        } else {
            String sessionKey = event.getSessionKey();
            boolean sessionKeyIsValid = state.contains(sessionKey);
            if (sessionKeyIsValid) {
                state.get(sessionKey).setUpdated(System.currentTimeMillis());
                ClockEvent returnEvent = new ClockEvent(UI_START_WITH_KEY_EVENT);
                returnEvent.setSessionKey(sessionKey);
                log.info("valid session {}", sessionKey);
                return returnEvent;
            } else {
                log.info("invalid session {}", sessionKey);
                return ClockEvent.buildErrorEvent()
                        .add(ERROR_DESCRIPTION, "Invalid session key");
            }
        }
    }

    private ClockEvent validateSessionFromEvent(ClockEvent event) throws Exception {
        String sessionKey = event.getSessionKey();
        boolean sessionKeyExists = state.contains(sessionKey);
        if (!sessionKeyExists) {
            return ClockEvent.buildErrorEvent()
                    .add(ERROR_DESCRIPTION, "Invalid session key")
                    .addSessionKey(sessionKey);
        } else {
            return event;
        }
    }

    private ClockEvent generateNewSession() throws Exception {
        String sessionKey = null;
        while (sessionKey == null || state.contains(sessionKey)) {
            sessionKey = generateNewSessionKey();
        }
        log.info("new session {}", sessionKey);
        state.put(sessionKey, new KeyInfo());
        ClockEvent returnEvent = new ClockEvent(UI_START_WITHOUT_KEY_EVENT);
        returnEvent.setSessionKey(sessionKey);
        return returnEvent;
    }

    Random generator = new Random();
    String generateNewSessionKey() {
        return String.format("%08x", generator.nextInt());
    }

}
