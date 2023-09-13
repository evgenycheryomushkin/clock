"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const kafka_node_1 = require("kafka-node");
const client = new kafka_node_1.KafkaClient({ kafkaHost: 'localhost:9092' });
const consumer = new kafka_node_1.Consumer(client, [{ topic: 'worktask-outgoing-events', partition: 0 }], { autoCommit: false });
consumer.on('message', function (message) {
    console.log(message);
});
