package com.cheremushkin.validate;

import com.cheremushkin.Util;
import com.cheremushkin.data.WorkEvent;
import org.apache.flink.api.common.functions.RichMapFunction;
import org.apache.flink.api.common.state.MapState;
import org.apache.flink.api.common.state.MapStateDescriptor;
import org.apache.flink.api.common.typeinfo.TypeInformation;

import java.time.ZonedDateTime;

/**
 * Validate key. Create new key in case of new session. Validate existing key
 * if session already exists.
 */
public class ValidateKeyFunction extends RichMapFunction<WorkEvent, WorkEvent> {

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
                String key = Util.generate();
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
}
