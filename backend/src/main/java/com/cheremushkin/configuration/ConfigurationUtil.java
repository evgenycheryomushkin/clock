package com.cheremushkin.configuration;

public class ConfigurationUtil {
    public static ConfigurationVariables loadConfigurationVariables() {
        ConfigurationVariables configurationVariables = new ConfigurationVariables();
        configurationVariables.setRabbitHost(getRabbitHostFromEnv());
        configurationVariables.setRabbitQueueName("backend");
        return configurationVariables;
    }

    private static String getRabbitHostFromEnv() {
        String defaultRabbitHost = "localhost";
        String rabbitHost = System.getenv("RABBIT_HOST");
        if (rabbitHost == null) rabbitHost = defaultRabbitHost;
        return rabbitHost;
    }
}
