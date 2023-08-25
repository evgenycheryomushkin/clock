package com.cheremushkin.validate;

import com.cheremushkin.data.WorkEvent;
import org.apache.flink.api.common.functions.RichMapFunction;
import org.apache.flink.api.common.state.MapState;
import org.apache.flink.api.common.state.MapStateDescriptor;
import org.apache.flink.api.common.typeinfo.TypeInformation;

import java.time.ZonedDateTime;
import java.util.Random;

/**
 * Validate key. Create new key in case of new session. Validate existing key
 * if session already exists.
 */
public class ValidateKeyFunction extends RichMapFunction<WorkEvent, WorkEvent> {

    Random r = new Random();
    int maxAttempts = 10;
    int keyLength = 4;
    /**
     * Map of session keys and their information.
     * Information contains creation date and modification date.
     */
    MapStateDescriptor<String, KeyInfo> keyMapDescriptor =
            new MapStateDescriptor<String, KeyInfo>(
                    "keyMap", TypeInformation.of(String.class),
                    TypeInformation.of(KeyInfo.class));

    @Override
    public WorkEvent map(WorkEvent event) throws Exception {
        if (event.getType().equals(WorkEvent.UI_START_EVENT)) {
            MapState<String, KeyInfo> keyMap = getRuntimeContext().getMapState(keyMapDescriptor);
            if (!event.getData().containsKey(WorkEvent.SESSION_KEY)) {
                // this session is new
                // we should generate new key here
                String key = null;
                int attempt = 0;
                while (key == null || keyMap.contains(key)) {
                    if (attempt++ > maxAttempts) {
                        attempt = 0;
                        keyLength ++;
                    }
                    key = generate(keyLength);
                }
                keyMap.put(key, new KeyInfo());
                return WorkEvent.builder()
                        .type(WorkEvent.UI_START_WITHOUT_KEY_EVENT)
                        .build()
                        .add(WorkEvent.SESSION_KEY, key);
            } else {
                // This session is existing. User returned with this key
                String key = event.getData().get(WorkEvent.SESSION_KEY);
                if (keyMap.contains(key)) {
                    // key is valid
                    keyMap.get(key).updated = ZonedDateTime.now();
                    return WorkEvent.builder().type(WorkEvent.UI_START_WITH_KEY_EVENT).build()
                            .add(WorkEvent.SESSION_KEY, event.getData().get(WorkEvent.SESSION_KEY));
                } else {
                    // key is not valid
                    return WorkEvent.buildErrorEvent();
                }
            }
        } else {
            // another event - just move forward
            return event;
        }
    }

    /**
     * Generate new key or id. Key consists of 4 hex digits.
     * @return new key or id, that contains 4 hex digits.
     */
    String generate(int keyLength) {
        return String.format("%08x", r.nextInt()).substring(0,keyLength);
    }
}
