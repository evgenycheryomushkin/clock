import { Injectable } from '@angular/core';
import { WorkEvent } from '../data/work-event';
import { EventHubService } from './event-hub.service';
import { Card } from '../data/card';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  public cards = new Array<Card>()

  constructor(eventHubService: EventHubService) { 
    const cardService = this;
    /**
     * Signal to add new card. 
     * Event is sent from add.component. 
     * This event already contains verification from allow.service.
     * Send CARD_GET_ID_EVENT further to backend.
     */
    eventHubService.subscribe(WorkEvent.ALLOW_ADD_EVENT,
      () => {
        return new WorkEvent(WorkEvent.CARD_GET_ID_EVENT)
      }
    )
    /**
     * Receive new ID from backend and start
     * dragging new card to given position
     */
    eventHubService.subscribe(WorkEvent.BACKEND_NEW_ID_EVENT,
      (event: WorkEvent) => {
        const card = new Card(event.data.get(WorkEvent.ID), "", "", new Date(), {x:0, y:0})
        this.cards.push(card)
      }
    )
  }

    init() {
      console.log("Card Service initialized")
    }  
  }
