import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { EventHubService } from './event-hub.service';
import { WorkEvent } from '../data/work-event';
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
        WorkEvent.APP_NAVIGATION_END_EVENT,
        (event: WorkEvent, eventProcessor: EventProcessor) => {
            const res = new WorkEvent(WorkEvent.UI_START_EVENT, event)
            eventProcessor.emit(res)
        })
    
    eventHubService.subscribe(
      WorkEvent.BACKEND_NEW_KEY_EVENT,
      (event: WorkEvent, eventProcessor: EventProcessor) => {
        routingService.key = event.data.get(WorkEvent.SESSION_KEY)
        routingService.location.replaceState("/"+routingService.key)
      })
  }
}
