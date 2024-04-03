package com.cheremushkin;

import com.cheremushkin.data.Card;
import com.cheremushkin.function.MapToSpecificEventFunction;
import com.cheremushkin.event.ClockEvent;
import com.cheremushkin.transport.ClockEnvelope;
import com.cheremushkin.data.KeyInfo;
import com.cheremushkin.data.Session;
import com.cheremushkin.function.MainFunction;
import com.cheremushkin.rabbit.RMQDeserializer;
import com.cheremushkin.rabbit.RMQPublishOptions;
import com.cheremushkin.rabbit.RMQSerializer;
import com.cheremushkin.configuration.ConfigurationVariables;
import com.cheremushkin.configuration.ConfigurationUtil;
import com.cheremushkin.function.ValidateKeyFunction;
import org.apache.flink.streaming.api.CheckpointingMode;
import org.apache.flink.streaming.api.environment.CheckpointConfig;
import org.apache.flink.streaming.api.environment.StreamExecutionEnvironment;
import org.apache.flink.streaming.connectors.rabbitmq.RMQSink;
import org.apache.flink.streaming.connectors.rabbitmq.RMQSource;
import org.apache.flink.streaming.connectors.rabbitmq.common.RMQConnectionConfig;

public class ClockBackend {
    private static ConfigurationVariables configurationVariables;
    private static RMQConnectionConfig rabbitConnectionConfig;
    private static RMQSource<ClockEnvelope> rabbitSource;
    private static RMQSink<ClockEnvelope> rabbitSink;

    public static void main(String[] args) throws Exception {
        loadConfigurationVariables();
        initRabbitConfig(configurationVariables);

        initRMQSource(configurationVariables, rabbitConnectionConfig);
        initRMQSink(rabbitConnectionConfig);

        try(final StreamExecutionEnvironment environment = initStreamExecutionEnvironment()) {
            initPipeline(environment);
            environment.execute("Flink Clock");
        }
    }

    private static void initPipeline(StreamExecutionEnvironment environment) {
        environment
                .addSource(rabbitSource)
                .setParallelism(1)

                .keyBy(value -> "")
                .map(new ValidateKeyFunction())
                .uid("VALIDATE_SESSION_UID")

                .keyBy(envelope -> envelope.getClockEvent().getSessionKey())

                .map(new MapToSpecificEventFunction())
                .uid("MAP_EVENT_UID")

                .flatMap(new MainFunction())
                .uid("CARD_UID")

                .addSink(rabbitSink);
    }

    private static void loadConfigurationVariables() {
        configurationVariables = new ConfigurationUtil().loadConfigurationVariables();
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
        env.getCheckpointConfig().setExternalizedCheckpointCleanup(
                CheckpointConfig.ExternalizedCheckpointCleanup.RETAIN_ON_CANCELLATION
        );
        return env;
    }

    private static void initRabbitConfig(ConfigurationVariables configuration) {
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
            ConfigurationVariables configuration,
            RMQConnectionConfig rabbitConnectionConfig) {
        rabbitSource = new RMQSource<>(
                rabbitConnectionConfig, configuration.getRabbitQueueName(),
                false, new RMQDeserializer()
        );
    }

    private static void initRMQSink(RMQConnectionConfig rabbitConnectionConfig) {
        rabbitSink = new RMQSink<>(rabbitConnectionConfig,
                new RMQSerializer(), new RMQPublishOptions()
        );
    }
}
