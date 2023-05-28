import { Injectable } from '@angular/core';
import { CardEvent } from '../data/card-event';
import { EventHubService } from './event-hub.service';
import { Card } from '../data/card';
import { CardPlaceService } from './card-place.service';
import { Rectangle } from '../data/rectangle';
import { AllowService } from './allow.service';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  public cards = new Array<Card>()

  constructor(
    eventHubService: EventHubService,
    cardPlaceService: CardPlaceService,
    allowService: AllowService
  ) { 
    const cardService = this;
    /**
     * Signal to add new card. 
     * Event is sent from add.component. 
     * This event already contains verification from allow.service.
     * Send CARD_GET_ID_EVENT further to backend.
     */
    eventHubService.subscribe(CardEvent.ALLOW_ADD_EVENT,
      () => {
        return new CardEvent(CardEvent.CARD_GET_ID_EVENT)
      }
    )

    /**
     * Receive new ID from backend. Create new card and put it
     * into free space
     */
    eventHubService.subscribe(CardEvent.BACKEND_NEW_ID_EVENT,
      (event: CardEvent) => {
        const id = event.data.get(CardEvent.ID)
        if (!cardService.cardWithIdExists(id)) {
          const viewPort:Rectangle = {
            x: window.scrollX,
            y: window.scrollY,
            w: window.innerWidth,
            h: window.innerHeight
          }
          const place = cardPlaceService.findPlace(cardService.cards, viewPort)
          const card = new Card(id, "", "", Date.now(),
              {x:place.x, y:place.y})
          cardService.cards.push(card)
          allowService.endNew()
        }
      }
    )

    /**
     * Receive new ID from backend. Create new card and put it
     * into free space
     */
    eventHubService.subscribe(CardEvent.EMIT_CARD,
      (event: CardEvent) => {
        const id          = event.data.get(CardEvent.ID)
        const header      = event.data.get(CardEvent.CARD_HEADER)
        const description = event.data.get(CardEvent.CARD_DESCRIPTION)
        const x           = +event.data.get(CardEvent.CARD_X)
        const y           = +event.data.get(CardEvent.CARD_Y)

        // if (!cardService.cardsHasId(id)) {
          const card = new Card(id, header, description, 
          Date.now(), {x:x, y:y})
          cardService.cards.push(card)
        // }
      }
    )

    /**
    * Done card. Fired when done is clicked. Remove card from cards list.
    */
    eventHubService.subscribe(CardEvent.DONE_CARD_EVENT,
      (event: CardEvent) => {
        const cardsWithoutGiven: Card[] = new Array<Card>()
        cardService.cards.forEach(card => {
          if (event.data.get(CardEvent.ID) != card.id) cardsWithoutGiven.push(card)
        })
        cardService.cards = cardsWithoutGiven
      }
    )
  }
  cardWithIdExists(id: string): boolean {
    var idExists = false
    this.cards.forEach(card => {
      if (id == card.id) idExists = true
    })
    return idExists
  }

  init() {
    console.log("Card Service initialized")
  }
}
