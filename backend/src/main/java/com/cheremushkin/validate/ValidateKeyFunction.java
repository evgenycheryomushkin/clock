package com.cheremushkin;

import com.cheremushkin.data.WorkEvent;
import org.apache.flink.api.common.functions.RichMapFunction;
import org.apache.flink.configuration.Configuration;

public class ValidateKeyFunction extends RichMapFunction<WorkEvent, WorkEvent> {



    @Override
    public WorkEvent map(WorkEvent event) throws Exception {
        if (event.getType().equals(WorkEvent.UI_START_EVENT)) {
            if (!event.getData().containsKey(WorkEvent.SESSION_KEY)) {
                // this session is new
                // we should generate new key here
                return WorkEvent.builder().type(WorkEvent.UI_START_WITHOUT_KEY_EVENT).build();
            } else {
                // This session is existing. User returned with this key

            }
        }
    }

    private String generateKey() {
        return Integer.toHexString((int) (Math.random()*(4 << 8)));
    }

    @Override
    public void open(Configuration parameters) throws Exception {
        MapStateDescriptor<> keyMapDescriptor =
                new MapStateDescriptor<>(
                        "keyMap", // the state name
                        TypeInformation.of(new TypeHint<Tuple2<Long, Long>>() {}), // type information
                        Tuple2.of(0L, 0L)); // default value of the state, if nothing was set
        sum = getRuntimeContext().getState(descriptor);
    }
}
