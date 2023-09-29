package com.cheremushkin;

import com.cheremushkin.data.ClockEvent;
import com.cheremushkin.main.MainFunction;
import com.cheremushkin.validate.ValidateKeyFunction;
import org.apache.flink.streaming.api.datastream.DataStream;
import org.apache.flink.streaming.api.datastream.SingleOutputStreamOperator;
import org.apache.flink.streaming.api.environment.StreamExecutionEnvironment;
import org.apache.flink.streaming.connectors.rabbitmq.RMQSink;
import org.apache.flink.streaming.connectors.rabbitmq.RMQSource;
import org.apache.flink.streaming.connectors.rabbitmq.common.RMQConnectionConfig;

public class ClockBackend {

	public static void main(String[] args) throws Exception {
		final StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();

		final RMQConnectionConfig connectionConfig = new RMQConnectionConfig.Builder()
				.setHost("localhost")
				.setPort(5672)
				.setVirtualHost("/")
				.setUserName("guest")
				.setPassword("guest")
    			.build();

		final DataStream<ClockEvent> stream = env
				.addSource(new RMQSource<>(
						connectionConfig,
						"frontend-to-backend",
						true,
						new RMQDeserializer()))
				.setParallelism(1);


		SingleOutputStreamOperator<ClockEvent> outputStream = stream
				.keyBy(value -> "")
				.map(new ValidateKeyFunction())
				.uid("VALIDATE_SESSION_UID")
				.keyBy(ClockEvent::getSessionKey)
				.flatMap(new MainFunction())
				.uid("CARD_UID");

		outputStream.print();
		outputStream.addSink(new RMQSink<>(
				connectionConfig,
				"backend-to-frontend",
				new RMQSerializer()));

		env.execute("Flink Clock");
	}
}
