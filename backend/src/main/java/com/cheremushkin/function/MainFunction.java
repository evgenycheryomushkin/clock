package com.cheremushkin.function;

import com.cheremushkin.data.ClockEnvelope;
import com.cheremushkin.data.ClockEvent;
import com.cheremushkin.processor.EventProcessor;
import com.cheremushkin.processor.main.MainEventProcessor;
import lombok.extern.slf4j.Slf4j;
import org.apache.flink.api.common.functions.RichFlatMapFunction;
import org.apache.flink.configuration.Configuration;
import org.apache.flink.util.Collector;

import java.util.List;

@Slf4j
public class MainFunction extends RichFlatMapFunction<ClockEnvelope, ClockEnvelope> {

    EventProcessor eventProcessor;

    @Override
    public void flatMap(ClockEnvelope envelope, final Collector<ClockEnvelope> out) throws Exception {
        log.debug("main {}", envelope);

        final ClockEvent clockEvent = envelope.getClockEvent();
        final String replyToQueue = envelope.getReplyTo();

        final List<ClockEvent> returnEvents = eventProcessor.process(clockEvent);

        returnEvents.stream()
                .map(event -> new ClockEnvelope(replyToQueue, event))
                .forEach(out::collect);
    }

    @Override
    public void open(Configuration parameters) throws Exception {
        super.open(parameters);
        FlinkUserState userState = new FlinkUserState(getRuntimeContext());
        eventProcessor = new MainEventProcessor(userState);
    }
}
