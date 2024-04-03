package com.cheremushkin.function;

import com.cheremushkin.event.UIStartEvent;
import com.cheremushkin.transport.ClockEnvelope;
import org.apache.flink.api.common.functions.MapFunction;

public class MapToSpecificEventFunction implements MapFunction<ClockEnvelope, ClockEnvelope> {
    @Override
    public ClockEnvelope map(ClockEnvelope envelope) throws Exception {
        return new ClockEnvelope(envelope.getReplyTo(),
                UIStartEvent.build(envelope.getClockEvent()));
    }
}
