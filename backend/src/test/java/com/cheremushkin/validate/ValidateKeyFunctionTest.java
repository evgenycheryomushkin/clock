package com.cheremushkin.validate;

import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class ValidateKeyFunctionTest {
    @Test
    public void testGenerate() {
        ValidateKeyFunction v = new ValidateKeyFunction();
        String key = v.generate(4);
        assertEquals(4, key.length());
    }
}