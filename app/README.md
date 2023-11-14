# Clock frontend


2. Install and run GUI
```
cd app 
npm install
ng serve
```

### wireshark
tcp.port == 15674

1. Отправляется сообщение:

\Device\NPF_Loopback
Internet Protocol Version 4, Src: 127.0.0.1, Dst: 127.0.0.1
Transmission Control Protocol, Src Port: 52164, Dst Port: 15674
Line-based text data (6 lines)
    SEND\n
    destination:/queue/backend\n
    reply-to:/temp-queue/clock\n
    content-length:78\n
    \n
    {"sessionKey":"","type":"UI_START_EVENT","createDate":1699340743670,"data":{}}\000

2. Создается очередь rabbitmq
amq.gen-5pMhkC0-vZLCre83er1ACw

3. Появляется сообщение
Exchange	(AMQP default)
Routing Key	backend
Redelivered	○
Properties	
reply_to:	amq.gen-5pMhkC0-vZLCre83er1ACw
headers:	
content-length:	78
Payload
78 bytes
Encoding: string
{"sessionKey":"","type":"UI_START_EVENT","createDate":1699340743670,"data":{}}
