package com.cheremushkin;

import com.cheremushkin.data.WorkEvent;
import com.cheremushkin.main.MainFunction;
import com.cheremushkin.validate.ValidateKeyFunction;
import org.apache.flink.api.common.eventtime.WatermarkStrategy;
import org.apache.flink.connector.base.DeliveryGuarantee;
import org.apache.flink.connector.kafka.sink.KafkaSink;
import org.apache.flink.connector.kafka.source.KafkaSource;
import org.apache.flink.connector.kafka.source.enumerator.initializer.OffsetsInitializer;
import org.apache.flink.connector.kafka.source.reader.deserializer.KafkaRecordDeserializationSchema;
import org.apache.flink.streaming.api.datastream.DataStreamSource;
import org.apache.flink.streaming.api.environment.StreamExecutionEnvironment;

public class WorkTaskBackend {

	public static void main(String[] args) throws Exception {
		final StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();

		KafkaSource<WorkEvent> source = buildKafkaSource();
		DataStreamSource<WorkEvent> stream = env.fromSource(source, WatermarkStrategy.noWatermarks(),
				"WorkTask Kafka Source");

		stream
				.map(new ValidateKeyFunction())
				.flatMap(new MainFunction())
				.sinkTo()
		env.execute("Flink Java API Skeleton");
	}

	private static buildKafkaSink() {
		KafkaSink<String> sink = KafkaSink.<String>builder()
				.setBootstrapServers("localhost:9092")

				.setRecordSerializer(KafkaRecordSerializationSchema.builder()
						.setTopic("topic-name")
						.setValueSerializationSchema(new SimpleStringSchema())
						.build()
				)
				.setDeliveryGuarantee(DeliveryGuarantee.AT_LEAST_ONCE)
				.build();
	}

	private static KafkaSource<WorkEvent> buildKafkaSource() {
		return KafkaSource.<WorkEvent>builder()
				.setBootstrapServers("localhost:9092")
				.setTopics("worktask-incoming-events")
				.setGroupId("flink")
				.setStartingOffsets(OffsetsInitializer.earliest())
				.setDeserializer(
						KafkaRecordDeserializationSchema.of(
								new WorkTaskKafkaDeserializer()
						)
				).build();
	}
}
