import { Injectable } from '@angular/core';
import { AppEvent } from './card/event/app-event';
import { CardServiceEvent } from './card/event/card-service-event';
import { WorkEvent } from './card/event/work-event';
import { EventHubService, EventSubscriber } from './event-hub.service';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  init() {
    console.log("Card Service initialized")
  }
  private nextId: number = 0

  newCardSubscriber: EventSubscriber | undefined

  constructor(private eventHubService: EventHubService) { 
    const cardService = this;
    this.newCardSubscriber = new class extends EventSubscriber {
      constructor() {
        super();
        this.next = (workEvent: WorkEvent) => {
            if (workEvent.type == AppEvent.NEW_CARD) 
              this.emit(cardService.newCard())
        }
    }
    }    
    eventHubService.sourceSream.register(this.newCardSubscriber)
  }
  
  newCard(): CardServiceEvent {
      const e = new CardServiceEvent(CardServiceEvent.NEW_ID);
      e.id = ++this.nextId;
      return e;
  }
}
