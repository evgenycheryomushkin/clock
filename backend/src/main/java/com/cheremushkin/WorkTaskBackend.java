package com.cheremushkin;

import com.cheremushkin.data.WorkEvent;
import com.cheremushkin.main.MainFunction;
import com.cheremushkin.validate.ValidateKeyFunction;
import org.apache.flink.api.common.eventtime.WatermarkStrategy;
import org.apache.flink.api.common.serialization.SimpleStringSchema;
import org.apache.flink.connector.base.DeliveryGuarantee;
import org.apache.flink.connector.kafka.sink.KafkaRecordSerializationSchema;
import org.apache.flink.connector.kafka.sink.KafkaSink;
import org.apache.flink.connector.kafka.source.KafkaSource;
import org.apache.flink.connector.kafka.source.enumerator.initializer.OffsetsInitializer;
import org.apache.flink.connector.kafka.source.reader.deserializer.KafkaRecordDeserializationSchema;
import org.apache.flink.streaming.api.datastream.DataStreamSource;
import org.apache.flink.streaming.api.datastream.SingleOutputStreamOperator;
import org.apache.flink.streaming.api.environment.StreamExecutionEnvironment;

public class WorkTaskBackend {

	public static final String BOOTSTRAP_SERVER = "localhost:9092";
	public static final String OUTPUT_TOPIC = "clock-backend-to-frontend";
	public static final String INPUT_TOPIC = "clock-frontend-to-backend";

	public static void main(String[] args) throws Exception {
		final StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();

		KafkaSource<WorkEvent> source = buildKafkaSource();
		DataStreamSource<WorkEvent> stream = env.fromSource(source, WatermarkStrategy.noWatermarks(),
				"WorkTask Kafka Source");

		KafkaSink<WorkEvent> sink = buildKafkaSink();

		SingleOutputStreamOperator<WorkEvent> outputStream = stream
				.map(new ValidateKeyFunction())
				.flatMap(new MainFunction());

		outputStream.print();
		outputStream.sinkTo(sink);

		env.execute("Flink Java API Skeleton");
	}

	private static KafkaSink<WorkEvent> buildKafkaSink() {
		return KafkaSink.<WorkEvent>builder()
				.setBootstrapServers(BOOTSTRAP_SERVER)
				.setRecordSerializer(KafkaRecordSerializationSchema.builder()
						.setTopic(OUTPUT_TOPIC)
						.setValueSerializationSchema(new WorkTaskKafkaSerializer())
						.build()
				)
				.setDeliveryGuarantee(DeliveryGuarantee.AT_LEAST_ONCE)
				.build();
	}

	private static KafkaSource<WorkEvent> buildKafkaSource() {
		return KafkaSource.<WorkEvent>builder()
				.setBootstrapServers("localhost:9092")
				.setTopics(INPUT_TOPIC)
				.setGroupId("flink")
				.setStartingOffsets(OffsetsInitializer.earliest())
				.setDeserializer(
						KafkaRecordDeserializationSchema.of(
								new WorkTaskKafkaDeserializer()
						)
				).build();
	}
}
