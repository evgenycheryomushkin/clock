# Work Task Repository
This repository is start of work task project. Create tests and arrange them in work desktop.

## Installation

1. Install and run kafka (windows). Linux is almost same, just paths are different.
Download kafka from official website. Unpack it to c:\kafka_2.13-3.4.0

Edit c:\kafka_2.13-3.4.0\conf\server.properties
```
log.dirs=c:/kafka_2.13-3.4.0/logs
delete.topic.enable=true
```

Edit c:\kafka_2.13-3.4.0\conf\zookeper.properties
```
dataDir=c:/kafka_2.13-3.4.0/data/zookeeper
```

#### Troubleshoot kafka
If kafka did not load then delete
```
rm c:/kafka_2.13-3.4.0/data -rf
rm c:/kafka_2.13-3.4.0/logs -rf
```

2. Install and run GUI
```
cd app 
npm install
ng serve
```

3. Install and run socket-server
```
cd socket-server
npm install
node .
```

4. Run backend "backend"
Import project into Intellij using gradle. Run main class.
