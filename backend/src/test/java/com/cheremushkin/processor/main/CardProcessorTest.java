package com.cheremushkin.processor.main;

import com.cheremushkin.transport.ClockEvent;
import lombok.NonNull;
import org.junit.Test;

import java.util.List;

import static com.cheremushkin.mapper.FrontendCardMapper.BACKEND_NEW_ID_EVENT;
import static com.cheremushkin.processor.main.CardProcessor.CARD_GET_ID_EVENT;
import static org.junit.Assert.assertEquals;

public class CardProcessorTest {
    @Test
    public void testShouldGenerateNewIdAndReturnCard() throws Exception {
        String sessionKey = "a1234567";
        ClockEvent event = ClockEvent.build(CARD_GET_ID_EVENT, sessionKey);
        TestCardUserState testCardUserState = new TestCardUserState();
        CardProcessor cardProcessor = new CardProcessor(testCardUserState);
        @NonNull List<ClockEvent> res = cardProcessor.process(event);
        assertEquals(1, res.size());
        assertEquals(sessionKey, res.get(0).getSessionKey());
        assertEquals(BACKEND_NEW_ID_EVENT, res.get(0).getType());
    }

}