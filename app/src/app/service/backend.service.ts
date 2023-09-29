import { Injectable } from '@angular/core';
import { EventHubService } from './event-hub.service';
import { CardEvent } from '../data/card-event';
import { RoutingService } from './routing.service';
import { StompService } from '@stomp/ng2-stompjs';
import { Message } from '@stomp/stompjs';


/**
 * Backend service. It will receive messages
 * on internal event bus and send them 
 * to socket io. Also it will work backwards from socket io
 * to internal bus.
 * Later on socket server messages will be forwarded to kafka
 */
@Injectable({
  providedIn: 'root'
})
export class BackendService {
  
  init() {
    console.log("Backend Service was initialized")
  }

  constructor(
    eventHubService: EventHubService,
    private routingService: RoutingService,
    private stompService: StompService) { 

      const backend = this

      const subscription = this.stompService.subscribe('/queue/backend-to-frontend');
      subscription.subscribe((message: Message) => {
        const event: CardEvent = JSON.parse(message.body)
        console.log(event)
      })

      // subscribe to several events and forward them to backend
      eventHubService.subscribe(
        [CardEvent.CARD_GET_ID_EVENT, CardEvent.UI_START_EVENT],
        (event: CardEvent) => {
          event.sessionKey = backend.routingService.getKey()
          console.log("Send event to backend:", event)
          this.stompService.publish(
            { 
              destination: '/exchange/clock/backend', 
              body: JSON.stringify(event) 
            });
        }
      )
  }
}
