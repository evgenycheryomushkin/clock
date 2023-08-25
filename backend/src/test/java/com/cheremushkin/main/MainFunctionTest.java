package com.cheremushkin.main;

import org.apache.flink.streaming.api.operators.StreamFlatMap;
import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static org.junit.Assert.*;

public class MainFunctionTest {
    Logger log = LoggerFactory.getLogger(MainFunctionTest.class);

    @Test
    public void testGenerate() {
        MainFunction mf = new MainFunction();
        String key = mf.generate();
        assertEquals(8, key.length());
    }
}