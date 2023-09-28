### Run rabbitmq in docker 
```
docker build --tag 'clock-rabbit' .
docker run -it --rm --name clock-rabbit -p 5672:5672 -p 15672:15672 -p 15674:15674 clock-rabbit
docker exec -it clock-rabbit bash
```