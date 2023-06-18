import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { EventHubService } from './event-hub.service';
import { EventProcessor } from './event-processor';
import { WorkEvent } from './data/work-event';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  socket = io('http://localhost:3000');

  init() {
    console.log("Backend Service initialized")
  }

  constructor(eventHubService: EventHubService) { 
    eventHubService.buildProcessor(".*",
    (event: WorkEvent, eventProcessor: EventProcessor) => {
      event.data.set(WorkEvent.KEY, "test");
      this.socket.emit('message', JSON.stringify(event));
    })
  }
}
