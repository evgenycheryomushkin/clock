import { Injectable } from '@angular/core';
import { EventHubService } from './event-hub.service';
import { CardEvent } from '../data/card-event';
import { RoutingService } from './routing.service';
import { RxStompService } from '@stomp/ng2-stompjs';
import { Message, StompHeaders } from '@stomp/stompjs';
import { TSMap } from 'typescript-map';


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
    private eventHubService: EventHubService,
    private routingService: RoutingService,
    private stompService: RxStompService) {

      const backend = this

      stompService.unhandledMessage$.subscribe((message: Message) => {
        const event = JSON.parse(message.body)
        const cardEvent: CardEvent = new CardEvent(event.type)
        cardEvent.sessionKey = event.sessionKey
        cardEvent.data = new TSMap<string, string>()
        for(var prop in event.data) {
          cardEvent.data.set(prop, event.data[prop])
        }
        cardEvent.createDate = event.createDate

        if (
          cardEvent.type == CardEvent.BACKEND_EXISTING_KEY_EVENT ||
          cardEvent.type == CardEvent.BACKEND_NEW_KEY_EVENT ||
          cardEvent.type == CardEvent.BACKEND_NEW_ID_EVENT ||
          cardEvent.type == CardEvent.EMIT_CARD //TODO rename to backend emit card
        ) {
          const decryptedEvent = this.decrypt(cardEvent)
          backend.eventHubService.emit(decryptedEvent)
        }
      })

      // subscribe to several events and forward them to backend
      eventHubService.subscribe(
        [
          CardEvent.CARD_GET_ID_EVENT,
          CardEvent.UI_START_EVENT,
          CardEvent.UPDATE_CARD_EVENT,
          CardEvent.DONE_CARD_EVENT
        ],
        (event: CardEvent) => {
          const encryptedEvent = this.encrypt(event)
          if (backend.routingService.getKey() != "")
            encryptedEvent.sessionKey = backend.routingService.getKey()
          const headers: StompHeaders = {
            'reply-to': '/temp-queue/frontend'
          }
          this.stompService.publish(
            {
              destination: '/queue/backend',
              body: JSON.stringify(encryptedEvent),
              headers
            });
        }
      )
  }

  private decrypt(cardEvent: CardEvent): CardEvent {
    const decryptedEvent = cardEvent.clone()
    if (decryptedEvent.data.has(CardEvent.CARD_HEADER)) {
      const header = decryptedEvent.data.get(CardEvent.CARD_HEADER)
      decryptedEvent.data.set(CardEvent.CARD_HEADER, atob(header))
    }
    if (decryptedEvent.data.has(CardEvent.CARD_DESCRIPTION)) {
      const description = decryptedEvent.data.get(CardEvent.CARD_DESCRIPTION)
      decryptedEvent.data.set(CardEvent.CARD_DESCRIPTION, atob(description))
    }
    return decryptedEvent
  }

  private encrypt(event: CardEvent): CardEvent {
    const encryptedEvent = event.clone()
    if (encryptedEvent.data.has(CardEvent.CARD_HEADER)) {
      const header = encryptedEvent.data.get(CardEvent.CARD_HEADER)
      encryptedEvent.data.set(CardEvent.CARD_HEADER, btoa(header))
    }
    if (encryptedEvent.data.has(CardEvent.CARD_DESCRIPTION)) {
      const description = encryptedEvent.data.get(CardEvent.CARD_DESCRIPTION)
      encryptedEvent.data.set(CardEvent.CARD_DESCRIPTION, btoa(description))
    }
    return encryptedEvent
  }
}
