import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { EventHubService } from './event-hub.service';
import { WorkEvent } from '../data/work-event';
import { RoutingService } from './routing.service';
@Injectable({
  providedIn: 'root'
})
export class BackendService {
  SOCKET_IO_URI = 'http://localhost:3000'
  BACKEND_SOCKET_NAME = 'backend'

  // private socket = io(this.SOCKET_IO_URI);

  init() {
    console.log("Backend Service was initialized")
  }

  constructor(
    private eventHubService: EventHubService,
    private routingService: RoutingService) { 
    const backend = this
    // this event 
    eventHubService.subscribe(
      WorkEvent.CARD_GET_ID_EVENT,
      (event: WorkEvent) => {
        backend.eventHubService.emit(
          new WorkEvent(WorkEvent.BACKEND_NEW_ID_EVENT, WorkEvent.ID, backend.generateNewId())
        )
        // event.data.set(WorkEvent.SESSION_KEY, backend.routingService.getKey())
        // this.socket.emit(backend.BACKEND_SOCKET_NAME, JSON.stringify(event))
      }
    )
    eventHubService.subscribe(
      WorkEvent.UI_START_EVENT,
      (event: WorkEvent) => {
        if (event.data.get(WorkEvent.SESSION_KEY) == "") {
          backend.eventHubService.emit(
            new WorkEvent(WorkEvent.BACKEND_NEW_KEY_EVENT, WorkEvent.SESSION_KEY, backend.generateNewId())
          )
        }
      }
    )
  }

  generateNewId(): string {
    return [...crypto.getRandomValues(new Uint8Array(8))].map(m=>('0'+m.toString(16)).slice(-2)).join('');
  }
}
