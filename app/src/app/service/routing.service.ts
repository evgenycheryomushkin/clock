import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { EventHubService } from './event-hub.service';
import { CardEvent } from '../data/card-event';
import { EventProcessor } from '../core/event-processor';
import {Location} from '@angular/common';

/**
 * Takes care of session key (key parameter). Store key and 
 * give it to events if necessary by getKey
 */
@Injectable({
  providedIn: 'root'
})
export class RoutingService {

  private key: string = ""

  init() {
    console.log("Routing Service was initialized")
  }

  getKey(): string {
    return this.key
  }

  constructor(eventHubService: EventHubService,
    private location: Location
    ) { 
    const routingService = this
    eventHubService.subscribe(
        CardEvent.APP_NAVIGATION_END_EVENT,
        (event: CardEvent, eventProcessor: EventProcessor) => {
            const res = new CardEvent(CardEvent.UI_START_EVENT, event)
            eventProcessor.emit(res)
        })
    
    eventHubService.subscribe(
      CardEvent.BACKEND_NEW_KEY_EVENT,
      (event: CardEvent, eventProcessor: EventProcessor) => {
        routingService.key = event.sessionKey
        routingService.location.replaceState("/"+routingService.key)
      })
  }
}
