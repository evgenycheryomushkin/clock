package com.cheremushkin.configuration;

public class ConfigurationUtil {
    public ConfigurationVariables loadConfigurationVariables() {
        ConfigurationVariables configurationVariables = new ConfigurationVariables();
        configurationVariables.setRabbitHost(getRabbitHostFromEnv());
        configurationVariables.setRabbitQueueName("backend");
        return configurationVariables;
    }

    private String getRabbitHostFromEnv() {
        String defaultRabbitHost = "localhost";
        String rabbitHost = getEnv("RABBIT_HOST");
        if (rabbitHost == null) rabbitHost = defaultRabbitHost;
        return rabbitHost;
    }

    protected String getEnv(String envVariable) {
        return System.getenv(envVariable);
    }
}
