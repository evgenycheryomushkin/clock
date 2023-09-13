import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { EventHubService } from './event-hub.service';
import { WorkEvent } from '../data/work-event';
import { RoutingService } from './routing.service';


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
  SOCKET_IO_URI = 'http://localhost:3000'
  BACKEND_SOCKET_NAME = 'backend'

  private socket = io(this.SOCKET_IO_URI);

  init() {
    console.log("Backend Service was initialized")
  }

  constructor(
    private eventHubService: EventHubService,
    private routingService: RoutingService) { 
    const backend = this

    // subscribe to several events and forward them to backend
    eventHubService.subscribe(
      [WorkEvent.CARD_GET_ID_EVENT, WorkEvent.UI_START_EVENT],
      (event: WorkEvent) => {
        event.data.set(WorkEvent.SESSION_KEY, backend.routingService.getKey())
        this.socket.emit(backend.BACKEND_SOCKET_NAME, JSON.stringify(event))
      }
    )
  }

  // generateNewId(): string {
  //   return [...crypto.getRandomValues(new Uint8Array(8))].map(m=>('0'+m.toString(16)).slice(-2)).join('');
  // }
}
