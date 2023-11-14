import { InjectableRxStompConfig } from '@stomp/ng2-stompjs';

export const myRxStompConfig: InjectableRxStompConfig = {
  brokerURL: 'ws://localhost:15674/ws',

  connectHeaders: {
    login: 'guest',
    passcode: 'guest'
  },

  heartbeatIncoming: 0, 
  heartbeatOutgoing: 0, // Typical value 20000 - every 20 seconds

  reconnectDelay: 200,

  debug: (msg: string): void => {
    console.log(new Date(), msg);
  }
};
