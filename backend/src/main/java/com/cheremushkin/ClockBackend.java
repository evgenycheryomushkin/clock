package com.cheremushkin;

import com.cheremushkin.data.Card;
import com.cheremushkin.data.ClockEvent;
import com.cheremushkin.data.ClockEnvelope;
import com.cheremushkin.data.KeyInfo;
import com.cheremushkin.data.Session;
import com.cheremushkin.main.MainFunction;
import com.cheremushkin.validate.ValidateKeyFunction;
import org.apache.flink.streaming.api.CheckpointingMode;
import org.apache.flink.streaming.api.datastream.DataStream;
import org.apache.flink.streaming.api.datastream.SingleOutputStreamOperator;
import org.apache.flink.streaming.api.environment.CheckpointConfig;
import org.apache.flink.streaming.api.environment.StreamExecutionEnvironment;
import org.apache.flink.streaming.connectors.rabbitmq.RMQSink;
import org.apache.flink.streaming.connectors.rabbitmq.RMQSource;
import org.apache.flink.streaming.connectors.rabbitmq.common.RMQConnectionConfig;

public class ClockBackend {

    public static void main(String[] args) throws Exception {
        String rabbitHost = System.getenv("RABBIT_HOST");
        if (rabbitHost == null) rabbitHost = "localhost";
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

        final RMQConnectionConfig connectionConfig = new RMQConnectionConfig.Builder()
                .setHost(rabbitHost)
                .setPort(5672)
                .setVirtualHost("/")
                .setUserName("guest")
                .setPassword("guest")
                .build();

        final DataStream<ClockEnvelope> stream = env
                .addSource(new RMQSource<>(
                        connectionConfig,
                        "backend",
                        false,
                        new RMQDeserializer()))
                .setParallelism(1);


        SingleOutputStreamOperator<ClockEnvelope> outputStream = stream
                .keyBy(value -> "")
                .map(new ValidateKeyFunction())
                .uid("VALIDATE_SESSION_UID")
                .keyBy(envelope -> envelope.getClockEvent().getSessionKey())
                .flatMap(new MainFunction())
                .uid("CARD_UID");

        outputStream.addSink(new RMQSink<>(
                connectionConfig,
                new RMQSerializer(),
                new RMQPublishOptions()));

        env.execute("Flink Clock");
    }
}
