import { Injectable } from '@angular/core';
import { WorkEvent } from '../data/work-event';
import { EventHubService } from './event-hub.service';
import { Card } from '../data/card';
import { CardPlaceService } from './card-place.service';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  public cards = new Array<Card>()

  constructor(
    eventHubService: EventHubService,
    cardPlaceService: CardPlaceService
  ) { 
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
     * Receive new ID from backend. Create new card and put it
     * into free space
     */
    eventHubService.subscribe(WorkEvent.BACKEND_NEW_ID_EVENT,
      (event: WorkEvent) => {
        const card = new Card(event.data.get(WorkEvent.ID), "", "", new Date())
        const place = cardPlaceService.findPlace(cardService.cards)
        cardService.cards.push(card)
      }
    )
  }

  init() {
    console.log("Card Service initialized")
  }
}
