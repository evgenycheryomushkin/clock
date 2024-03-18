package com.cheremushkin.util;

public class Util {
    public static Configuration loadConfiguration() {
        Configuration configuration = new Configuration();
        configuration.setRabbitHost(getRabbitHostFromEnv());
        configuration.setRabbitQueueName("backend");
        return configuration;
    }

    private static String getRabbitHostFromEnv() {
        String defaultRabbitHost = "localhost";
        String rabbitHost = System.getenv("RABBIT_HOST");
        if (rabbitHost == null) rabbitHost = defaultRabbitHost;
        return rabbitHost;
    }
}
