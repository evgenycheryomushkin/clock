import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { EventHubService } from './event-hub.service';
import { WorkEvent } from './data/work-event';

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

  constructor(eventHubService: EventHubService) { 
    const backend = this
    eventHubService.subscribe(
      "KEY_EVENT",
      (event: WorkEvent) => {
          const res = new WorkEvent(WorkEvent.BACKEND_INIT,
            WorkEvent.KEY, event.data.get(WorkEvent.KEY))
          
          this.socket.emit(backend.BACKEND_SOCKET_NAME, JSON.stringify(res))
      })
  }
}
