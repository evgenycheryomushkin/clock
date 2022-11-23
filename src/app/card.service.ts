import { Injectable } from '@angular/core';
import { CardServiceEvent } from './card/event/card-service-event';
import { HubEvent } from './card/event/hub-event';
import { EventHubService } from './event-hub.service';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private nextId: number = 0

  constructor() { }
  
  process(event: HubEvent) {
    if (event.type == HubEvent.GET_NEW_ID) {
      const e = new CardServiceEvent(CardServiceEvent.NEW_ID);
      e.id = ++this.nextId;
    }
  }
}
