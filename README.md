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
1. Change apiHost in 
```
nano app/src/environments/environment.prod.ts
```
2. Build and run docker project
```
sudo chmod a+rwx flink -R
docker compose -f frontend.yaml -f backend.yaml -f rabbit.yaml build
docker compose -f frontend.yaml -f backend.yaml -f rabbit.yaml up
```
3. open `localhost:8080` in browser

#### Image credits
https://www.sberbank.com/promo/kandinsky/
