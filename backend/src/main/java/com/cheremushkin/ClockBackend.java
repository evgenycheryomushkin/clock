package com.cheremushkin;

import com.cheremushkin.data.Card;
import com.cheremushkin.data.ClockEvent;
import com.cheremushkin.data.ClockEnvelope;
import com.cheremushkin.data.KeyInfo;
import com.cheremushkin.data.Session;
import com.cheremushkin.main.MainFunction;
import com.cheremushkin.rabbit.RMQDeserializer;
import com.cheremushkin.rabbit.RMQPublishOptions;
import com.cheremushkin.rabbit.RMQSerializer;
import com.cheremushkin.util.Configuration;
import com.cheremushkin.util.Util;
import com.cheremushkin.validate.ValidateKeyFunction;
import org.apache.flink.streaming.api.CheckpointingMode;
import org.apache.flink.streaming.api.environment.CheckpointConfig;
import org.apache.flink.streaming.api.environment.StreamExecutionEnvironment;
import org.apache.flink.streaming.connectors.rabbitmq.RMQSink;
import org.apache.flink.streaming.connectors.rabbitmq.RMQSource;
import org.apache.flink.streaming.connectors.rabbitmq.common.RMQConnectionConfig;

public class ClockBackend {

    private static Configuration configuration;
    private static RMQConnectionConfig rabbitConnectionConfig;
    private static RMQSource<ClockEnvelope> rabbitSource;
    private static RMQSink<ClockEnvelope> rabbitSink;

    public static void main(String[] args) throws Exception {
        initConfigurationVariables();
        initRabbitConfig(configuration);
        initRMQSource(configuration, rabbitConnectionConfig);
        initRMQSink(rabbitConnectionConfig);
        try(final StreamExecutionEnvironment environment =
                    initStreamExecutionEnvironment()) {
            environment
                    .addSource(rabbitSource)
                    .setParallelism(1)
                    .keyBy(value -> "")
                    .map(new ValidateKeyFunction())
                    .uid("VALIDATE_SESSION_UID")
                    .keyBy(envelope -> envelope.getClockEvent().getSessionKey())
                    .flatMap(new MainFunction())
                    .uid("CARD_UID")
                    .addSink(rabbitSink);

            environment.execute("Flink Clock");
        }
    }

    private static void initConfigurationVariables() {
        configuration = Util.loadConfiguration();
    }

    private static void initRabbitConfig(Configuration configuration) {
        String rabbitHost = configuration.getRabbitHost();
        rabbitConnectionConfig = new RMQConnectionConfig.Builder()
                .setHost(rabbitHost)
                .setPort(5672)
                .setVirtualHost("/")
                .setUserName("guest")
                .setPassword("guest")
                .build();
    }

    private static void initRMQSource(
            Configuration configuration,
            RMQConnectionConfig rabbitConnectionConfig) {
        rabbitSource = new RMQSource<>(
                rabbitConnectionConfig,
                configuration.getRabbitQueueName(),
                false,
                new RMQDeserializer());
    }

    private static void initRMQSink(RMQConnectionConfig rabbitConnectionConfig) {
        rabbitSink = new RMQSink<>(
                rabbitConnectionConfig,
                new RMQSerializer(),
                new RMQPublishOptions());
    }

    private static StreamExecutionEnvironment initStreamExecutionEnvironment() {
        final StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();
        env.getConfig().registerKryoType(Card.class);
        env.getConfig().registerKryoType(ClockEvent.class);
        env.getConfig().registerKryoType(KeyInfo.class);
        env.getConfig().registerKryoType(Session.class);
        env.getConfig().registerKryoType(ClockEnvelope.class);

        env.enableCheckpointing(300000);
        env.getCheckpointConfig().setCheckpointingMode(CheckpointingMode.EXACTLY_ONCE);
        env.getCheckpointConfig().setMinPauseBetweenCheckpoints(10000);
        env.getCheckpointConfig().setCheckpointTimeout(10000);
        env.getCheckpointConfig().setMaxConcurrentCheckpoints(1);

        env.getCheckpointConfig().enableExternalizedCheckpoints(
                CheckpointConfig.ExternalizedCheckpointCleanup.RETAIN_ON_CANCELLATION
        );
        return env;
    }
}
