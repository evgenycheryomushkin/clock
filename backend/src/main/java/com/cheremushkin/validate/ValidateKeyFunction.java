package com.cheremushkin.validate;

import com.cheremushkin.data.ClockEvent;
import com.cheremushkin.data.ClockEnvelope;
import com.cheremushkin.data.KeyInfo;
import lombok.extern.slf4j.Slf4j;
import org.apache.flink.api.common.functions.RichMapFunction;
import org.apache.flink.api.common.state.MapState;
import org.apache.flink.api.common.state.MapStateDescriptor;
import org.apache.flink.api.common.typeinfo.TypeInformation;

import java.util.Iterator;
import java.util.Random;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static com.cheremushkin.data.ClockEvent.ERROR_DESCRIPTION;

/**
 * Validate key. Create new key in case of new session. Validate existing key
 * if session already exists.
 */
@Slf4j
public class ValidateKeyFunction extends RichMapFunction<ClockEnvelope, ClockEnvelope> {

    Random r = new Random();
    /**
     * Map of session keys and their information.
     * Information contains creation date and modification date.
     */
    MapStateDescriptor<String, KeyInfo> keyMapDescriptor =
            new MapStateDescriptor<String, KeyInfo>(
                    "keyMap", TypeInformation.of(String.class),
                    TypeInformation.of(KeyInfo.class));

    @Override
    public ClockEnvelope map(ClockEnvelope envelope) throws Exception {
        MapState<String, KeyInfo> keyMap = getRuntimeContext().getMapState(keyMapDescriptor);
        String sessionKey;
        log.info("validate {}", envelope);
        log.info("total sessions {}", getAllKeys(keyMap));
        ClockEvent errorEvent;
        if (envelope.getClockEvent().getType().equals(ClockEvent.UI_START_EVENT)) {
            if (envelope.getClockEvent().getSessionKey() == null ||
                    envelope.getClockEvent().getSessionKey().isEmpty()) {
                // this session is new
                // we should generate new key here
                sessionKey = null;
                while (sessionKey == null || keyMap.contains(sessionKey)) {
                    sessionKey = generate();
                }
                keyMap.put(sessionKey, new KeyInfo());
                ClockEvent returnEvent = new ClockEvent(ClockEvent.UI_START_WITHOUT_KEY_EVENT);
                returnEvent.setSessionKey(sessionKey);
                return new ClockEnvelope(envelope.getReplyTo(),
                        returnEvent);
            } else {
                // This session is existing. User returned with this key
                sessionKey = envelope.getClockEvent().getSessionKey();
                if (keyMap.contains(sessionKey)) {
                    // key is valid
                    keyMap.get(sessionKey).setUpdated(System.currentTimeMillis());
                    ClockEvent returnEvent = new ClockEvent(ClockEvent.UI_START_WITH_KEY_EVENT);
                    returnEvent.setSessionKey(sessionKey);
                    return new ClockEnvelope(
                            envelope.getReplyTo(), returnEvent
                    );
                } else {
                    // key is not valid
                    errorEvent = ClockEvent.buildErrorEvent().add(ERROR_DESCRIPTION, "Invalid session key");
                    return new ClockEnvelope(envelope.getReplyTo(), errorEvent);
                }
            }
        } else {
            // another event - just move forward
            sessionKey = envelope.getClockEvent().getSessionKey();
            if (!keyMap.contains(sessionKey)) {
                errorEvent = ClockEvent.buildErrorEvent().add(ERROR_DESCRIPTION, "Invalid session key")
                        .sessionKey(sessionKey);
                return new ClockEnvelope(envelope.getReplyTo(), errorEvent);
            } else {
                return envelope;
            }
        }
    }

    private String getAllKeys(MapState<String, KeyInfo> keyMap) throws Exception {
        return StreamSupport
                .stream(keyMap.keys().spliterator(), false)
                .collect(Collectors.joining(","));
    }

    /**
     * Generate new key or id. Key consists of 8 hex digits.
     *
     * @return new key or id, that contains 8 hex digits.
     */
    String generate() {
        return String.format("%08x", r.nextInt());
    }
}
