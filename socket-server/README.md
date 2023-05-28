## run code
`node .`

```
cd c:\kafka_2.13-3.4.0
bin/windows/zookeeper-server-start.bat config/zookeeper.properties
bin/windows/kafka-server-start.bat config/server.properties

bin/windows/kafka-topics.bat --create --topic worktask-incoming-events --bootstrap-server localhost:9092
bin/windows/kafka-console-consumer.bat --topic worktask-incoming-events --from-beginning --bootstrap-server localhost:9092
```