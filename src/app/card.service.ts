import { Injectable } from '@angular/core';
import { WorkEvent } from './work-event';
import { EventHubService } from './event-hub.service';
import { EventProcessor } from './event-processor';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  init() {
    console.log("Card Service initialized")
  }
  private nextId: number = 1

  constructor(eventHubService: EventHubService) { 
    const cardService = this;
    eventHubService.buildProcessor(WorkEvent.NEW_CARD,
      (event: WorkEvent, eventProcessor: EventProcessor) => {
        eventProcessor.emit(new WorkEvent(WorkEvent.NEW_WITH_ID, 
          WorkEvent.ID, cardService.nextId++))
      })
  }
}
