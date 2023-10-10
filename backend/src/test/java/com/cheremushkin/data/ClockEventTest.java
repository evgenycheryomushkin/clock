package com.cheremushkin.data;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.exc.ValueInstantiationException;
import org.junit.Test;


public class ClockEventTest {
    ObjectMapper mapper = new ObjectMapper();

    @Test(expected = ValueInstantiationException.class)
    public void deserialize1() throws JsonProcessingException {
        String pojoString = "{\"type\":\"UI_START_EVENT\",\"createDate\":1695992828756,\"data\":{\"SESSION_KEY\":\"\"}}";
        mapper.readValue(pojoString, ClockEvent.class);
    }

    @Test
    public void deserialize2() throws JsonProcessingException {
        String pojoString = "{\"type\":\"UI_START_EVENT\",\"createDate\":1695992828756,\"sessionKey\":\"\",\"data\":{\"SESSION_KEY\":\"\"}}";
        mapper.readValue(pojoString, ClockEvent.class);
    }
}