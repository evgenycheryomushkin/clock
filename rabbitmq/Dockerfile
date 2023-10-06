FROM rabbitmq:3.12-management
RUN apt-get update
RUN rabbitmq-plugins enable rabbitmq_web_stomp
COPY rabbitmq.conf /etc/rabbitmq/
COPY definitions.json /etc/rabbitmq/
