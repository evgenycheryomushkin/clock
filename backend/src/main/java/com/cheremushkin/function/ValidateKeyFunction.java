package com.cheremushkin.function;

import com.cheremushkin.data.ClockEnvelope;
import com.cheremushkin.data.ClockEvent;
import com.cheremushkin.data.KeyInfo;
import com.cheremushkin.processor.validate.ValidateEventProcessor;
import lombok.extern.slf4j.Slf4j;
import org.apache.flink.api.common.functions.RichMapFunction;
import org.apache.flink.api.common.state.MapState;
import org.apache.flink.api.common.state.MapStateDescriptor;
import org.apache.flink.api.common.typeinfo.TypeInformation;
import org.apache.flink.configuration.Configuration;

@Slf4j
public class ValidateKeyFunction extends RichMapFunction<ClockEnvelope, ClockEnvelope> {
    ValidateEventProcessor processor;

    @Override
    public ClockEnvelope map(ClockEnvelope envelope) throws Exception {
        log.debug("validate {}", envelope);
        ClockEvent resultEvent = processor.process(envelope.getClockEvent());
        return new ClockEnvelope(envelope.getReplyTo(), resultEvent);
    }

    @Override
    public void open(Configuration parameters) throws Exception {
        super.open(parameters);
        MapState<String, KeyInfo> sessionKeyMap = initState();
        processor = new ValidateEventProcessor(sessionKeyMap);
    }

    private MapState<String, KeyInfo>  initState() {
        final MapStateDescriptor<String, KeyInfo> keyMapDescriptor =
                new MapStateDescriptor<String, KeyInfo>(
                        "keyMap", TypeInformation.of(String.class),
                        TypeInformation.of(KeyInfo.class));
        return getRuntimeContext().getMapState(keyMapDescriptor);
    }
}
