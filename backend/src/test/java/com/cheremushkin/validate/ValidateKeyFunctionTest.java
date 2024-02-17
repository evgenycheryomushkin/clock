package com.cheremushkin.validate;

import com.cheremushkin.data.ClockEnvelope;
import org.junit.Test;
import org.apache.flink.streaming.util.KeyedOneInputStreamOperatorTestHarness;

import static org.junit.Assert.assertEquals;

public class ValidateKeyFunctionTest {
    KeyedOneInputStreamOperatorTestHarness<ClockEnvelope, ClockEnvelope>
        operatorTestHarness = new

    @Test
    public void testGenerate() {
        ValidateKeyFunction v = new ValidateKeyFunction();
        String key = v.generate();
        assertEquals(8, key.length());
    }
}