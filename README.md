# Clock
This is angular app that displays clock with task scheduler. There are clock to the left. You can create tasks, edit them and mark them as done.

### Project status
This project is in development stage. 

## Structure
The structure of project
1. Frontend, angular, stomp
2. Pre-back, rabbitmq
3. Backend, Apache Flink

This project is implemented using event-driven architecture. Events passes from frontend to backend using rabbitmq.

### Run the project
```
sudo chmod a+rwx flink -R
docker compose build
docker compose up
```

###Docker helper commands

docker ps -a
docker exec -it flinkjar bash
docker run --rm -it --entrypoint /bin/bash clock_backend

docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)



> docker ps
a064532330c8   flink:1.17.1-scala_2.12-java11   "/docker-entrypoint.…"   29 seconds ago   Up 4 seconds              6123/tcp, 0.0.0.0:8081->8081/tcp     clock-jobmanager-1

> docker exec -it a064532330c8  bash
root@a064532330c8:/opt/flink# flink run -s /tmp/flink-checkpoints-directory/6dd3dc929a3267e81d69b9722c1187ad/chk-10 /app/clock.jar


LINKS
https://github.com/stomp-js/ng2-stompjs-angular7
https://www.rabbitmq.com/stomp.html#d.tqd
https://habr.com/ru/articles/566210/
https://github.com/apache/flink-playgrounds/blob/master/operations-playground/docker-compose.yaml
https://visualskyrim.github.io/experiment/try-savepoint-in-flink/


#### Image credits
https://www.sberbank.com/promo/kandinsky/
