# worktask
This is simple angular clock with task scheduler.
### Project status
This project is in development stage. Clock works, Cards are not saved to backend.
## Supposed structure
The structure of project
1. Frontend, angular, stomp
2. Pre-back, rabbitmq
3. Backend, Apache Flink

This project is implemented using event-driven architecture. Events passes from frontend to backend using rabbitmq.



TODO
nano flink-1.17.1/conf/flink-conf.yaml
./flink-1.17.1/bin/start-cluster.sh
cp /mnt/c/nataraj/programs/home/Clock/backend/build/libs/worktask-backend-0.1-SNAPSHOT-all.jar .
./flink-1.17.1/bin/flink run worktask-backend-0.1-SNAPSHOT-all.jar



docker build --progress=plain --tag=clock_backend .
docker run flinkjar
docker exec -it flinkjar bash
docker run --rm -it --entrypoint /bin/bash clock_backend

docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)
