// credits https://medium.com/@deguzmanbrianfrancis/setting-up-and-creating-a-chat-app-with-angular-socket-io-3-0-and-express-70c69b8031f6
// https://stackoverflow.com/a/66339455/878241

const app = require('express')();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer, {
  cors: {origin : '*'}
});
const { Kafka } = require("kafkajs")
    
const clientId = "worktask"
const brokers = ["localhost:9092"]
const topicTo = "worktask-incoming-events"

const port = process.env.PORT || 3000;
const kafka = new Kafka({ clientId, brokers })
const producer = kafka.producer()
producer.connect()
const consumer = kafka.consumer({ groupId: clientId })

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('message', (message) => {
    console.log(message);
    produce({ message });
  });

  socket.on('disconnect', () => {
    console.log('a user disconnected!');
  });
});

// consume(({ from, to, message }) => {
//     io.sockets.emit('newMessage', { from, to, message });
//   })
  

httpServer.listen(port, () => console.log(`listening on port ${port}`));

const consume = async cb => {
    // first, we wait for the client to connect and subscribe to the given topic
    await consumer.connect()
    await consumer.subscribe({ topic })
    await consumer.run({
        // this function is called every time the consumer gets a new message
        eachMessage: ({ from, to, message }) => {
            cb({ from, to, message });
        },
    });
}

const produce = async ({ message }) => {
    producer.send( 
      {
        topic: topicTo,
        messages: [
          {value: message}
        ]
      }
    );
}