package com.cheremushkin.configuration;

import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class ConfigurationUtilTest {
    @Test
    public void testLoadConfigurationVariables() {
        ConfigurationVariables configurationVariables = new TestConfigurationUtil().loadConfigurationVariables();
        assertEquals("rabbit_host", configurationVariables.getRabbitHost());
        assertEquals("backend", configurationVariables.getRabbitQueueName());
    }

    static class TestConfigurationUtil extends ConfigurationUtil {
        protected String getEnv(String envVariable) {
            if ("RABBIT_HOST".equals(envVariable)) return "rabbit_host";
            else return null;
        }
    }

}