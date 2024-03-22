package com.cheremushkin.processor.main;

import com.cheremushkin.transport.ClockEvent;
import com.cheremushkin.state.FlinkUserState;
import com.cheremushkin.processor.EventProcessor;
import lombok.NonNull;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MainEventProcessor implements EventProcessor {
    final Map<String, EventProcessor> processors = new HashMap<>();
    final FlinkUserState state;

    public MainEventProcessor(FlinkUserState state) {
        this.state = state;
        registerProcessors();
    }

    @Override
    public @NonNull List<String> getApplicableEventTypes() {
        return Collections.emptyList();
    }

    @Override
    public @NonNull List<ClockEvent> process(@NonNull ClockEvent event) throws Exception {
        EventProcessor processor = processors.get(event.getType());
        if (processor != null) return processor.process(event);
        else return List.of(event);
    }

    private void registerProcessors() {
        registerProcessor(new UIStartEventProcessor(state));
        registerProcessor(new CardProcessor(state));
    }

    private void registerProcessor(EventProcessor processor) {
        processor.getApplicableEventTypes().forEach(type -> processors.put(type, processor));
    }
}
