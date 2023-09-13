import { KafkaClient, Consumer } from 'kafka-node';

const client = new KafkaClient({kafkaHost: 'localhost:9092'});
const consumer = new Consumer(
  client,
  [{ topic: 'worktask-outgoing-events', partition: 0 }],
  { autoCommit: false }
);

consumer.on('message', function (message) {
  console.log(message);
});