import { Injectable } from '@angular/core';
import { WorkEvent } from './work-event';
import { EventHubService } from './event-hub.service';
import { EventProcessor } from './event-processor';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  init() {
    console.log("Card Service initialized")
  }
  private nextId: number = 1

  socket = io('http://localhost:3000');

  constructor(eventHubService: EventHubService) { 
    const cardService = this;
    eventHubService.buildProcessor(WorkEvent.NEW_CARD,
      (event: WorkEvent, eventProcessor: EventProcessor) => {
        eventProcessor.emit(new WorkEvent(WorkEvent.NEW_WITH_ID, 
          WorkEvent.ID, ""+(cardService.nextId++)))
      })
      eventHubService.buildProcessor(".*",
        (event: WorkEvent, eventProcessor: EventProcessor) => {
          event.data.set(WorkEvent.KEY, "test");
          this.socket.emit('message', JSON.stringify(event));
        })
    }
}
