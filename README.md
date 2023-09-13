# worktask
This is simple angular clock with task scheduler.
### Project status
This project is in development stage. Clock works, Cards are not saved to backend.
## Supposed structure
The structure of project
1. Frontend, angular
2. Pre-back, node, socket.io
3. Backend, Apache Flink

This project is implemented using event-driven architecture. Events passes from frontend to backend using socket.io + kafka.

## Installation

### Kafka

##### Install and run kafka (windows). 
Linux is almost same, just paths are different. Download kafka from official website. Unpack it to c:\kafka_2.13-3.4.0

Edit c:\kafka_2.13-3.4.0\conf\server.properties
```
log.dirs=c:/kafka_2.13-3.4.0/logs
delete.topic.enable=true
```

Edit c:\kafka_2.13-3.4.0\conf\zookeper.properties
```
dataDir=c:/kafka_2.13-3.4.0/data/zookeeper
```

##### Create topics
```
C:\kafka_2.13-3.4.0\bin\windows>

kafka-topics.bat --list --bootstrap-server=localhost:9092
kafka-topics.bat --bootstrap-server=localhost:9092 --create --topic worktask-incoming-events
kafka-console-producer.bat --bootstrap-server localhost:9092 --topic worktask-outgoing-events
```


#### Troubleshoot kafka
If kafka did not load then delete
```
rm c:/kafka_2.13-3.4.0/data -rf
rm c:/kafka_2.13-3.4.0/logs -rf
```

