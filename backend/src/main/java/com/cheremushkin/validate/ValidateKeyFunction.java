package com.cheremushkin.validate;

import com.cheremushkin.data.ClockEvent;
import com.cheremushkin.data.KeyInfo;
import lombok.extern.slf4j.Slf4j;
import org.apache.flink.api.common.functions.RichMapFunction;
import org.apache.flink.api.common.state.MapState;
import org.apache.flink.api.common.state.MapStateDescriptor;
import org.apache.flink.api.common.typeinfo.TypeInformation;
import org.apache.flink.shaded.guava30.com.google.common.collect.Iterators;

import java.time.ZonedDateTime;
import java.util.Iterator;
import java.util.Random;

import static com.cheremushkin.data.ClockEvent.ERROR_DESCRIPTION;

/**
 * Validate key. Create new key in case of new session. Validate existing key
 * if session already exists.
 */
@Slf4j
public class ValidateKeyFunction extends RichMapFunction<ClockEvent, ClockEvent> {

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
    public ClockEvent map(ClockEvent event) throws Exception {
        MapState<String, KeyInfo> keyMap = getRuntimeContext().getMapState(keyMapDescriptor);
        String sessionKey;
        log.info("validate {}", event);
        log.info("total sessions {}", getSize(keyMap));
        if (event.getType().equals(ClockEvent.UI_START_EVENT)) {
            if (event.getSessionKey() == null || event.getSessionKey().isEmpty()) {
                // this session is new
                // we should generate new key here
                sessionKey = null;
                int attempt = 0;
                while (sessionKey == null || keyMap.contains(sessionKey)) {
                    sessionKey = generate();
                }
                keyMap.put(sessionKey, new KeyInfo());
                ClockEvent returnEvent = new ClockEvent(ClockEvent.UI_START_WITHOUT_KEY_EVENT);
                returnEvent.setSessionKey(sessionKey);
                return returnEvent;
            } else {
                // This session is existing. User returned with this key
                sessionKey = event.getSessionKey();
                if (keyMap.contains(sessionKey)) {
                    // key is valid
                    keyMap.get(sessionKey).setUpdated(System.currentTimeMillis());
                    ClockEvent returnEvent = new ClockEvent(ClockEvent.UI_START_WITH_KEY_EVENT);
                    returnEvent.setSessionKey(sessionKey);
                    return returnEvent;
                } else {
                    // key is not valid
                    return ClockEvent.buildErrorEvent().add(ERROR_DESCRIPTION, "Invalid session key");
                }
            }
        } else {
            // another event - just move forward
            sessionKey = event.getSessionKey();
            if (!keyMap.contains(sessionKey))
                return ClockEvent.buildErrorEvent().add(ERROR_DESCRIPTION, "Invalid session key");
            else
                return event;
        }
    }

    private long getSize(MapState<String, KeyInfo> keyMap) throws Exception {
        Iterator<String> iterator = keyMap.keys().iterator();
        return Iterators.size(iterator);
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
