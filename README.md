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

docker ps -a
docker exec -it flinkjar bash
docker run --rm -it --entrypoint /bin/bash clock_backend

docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)


docker compose build
docker compose up
Это запустит rabbitmq и flink в docker compose. Далее нужно зайти на консоль
localhost:8081 и задеплоить приложение.
cd backend
./gradlew installShadowDist
задеплоить артефакт 
\backend\build\libs\clock-backend-0.1-SNAPSHOT-all.jar
указать savepoint для восстановления 
/tmp/flink-checkpoints-directory/6bb7bc78b96b621413ccce50c4e084a3/chk-3

