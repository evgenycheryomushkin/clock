package com.cheremushkin.processor;

import com.cheremushkin.data.ClockEvent;
import lombok.NonNull;

import java.util.List;

public interface EventProcessor {
    /**
     * Get list of event types that can be processed by this processor.
     * Event name should start with Processor name. E.g.
     * UI_START_..._EVENT for UIStartEventProcessor
     */
    @NonNull List<String> getApplicableEventTypes();
    @NonNull List<ClockEvent> process(@NonNull ClockEvent event) throws Exception;
}
