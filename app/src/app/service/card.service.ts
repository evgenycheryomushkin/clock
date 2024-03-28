import {Injectable} from '@angular/core';
import {CardEvent} from '../data/card-event';
import {EventHubService} from './event-hub.service';
import {Card} from '../data/card';
import {CardPlaceService} from './card-place.service';
import {Rectangle} from '../data/rectangle';
import {AllowService} from './allow.service';
import {TSMap} from "typescript-map";

@Injectable({
  providedIn: 'root'
})
export class CardService {
  public cards = new TSMap<string, Card>()

  constructor(
    eventHubService: EventHubService,
    cardPlaceService: CardPlaceService,
    allowService: AllowService
  ) {
    const cardService = this;

   // this.cards.push(new Card("123", "test", "test", 1, {x:500, y:100}))

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
          const place = cardPlaceService.findPlace(cardService.cards.values(), viewPort)
          const card = new Card(id, "", "", Date.now(), {x:place.x, y:place.y})
          cardService.cards.set(card.id, card)
          setTimeout(() => {
            eventHubService.emit(new CardEvent(CardEvent.EDIT_CARD_EVENT, CardEvent.ID, card.id))
          }, 200)
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

        const card = new Card(id, header, description,
        Date.now(), {x:x, y:y})
        cardService.cards.set(card.id, card)
      }
    )

    /**
    * Done card. Fired when done is clicked. Remove card from cards list.
    */
    eventHubService.subscribe(CardEvent.DONE_CARD_EVENT,
      (event: CardEvent) => {
        const cardId = event.data.get(CardEvent.ID)
        this.cards.delete(cardId)
      }
    )
  }
  cardWithIdExists(id: string): boolean {
    return this.cards.has(id)
  }

  init() {
    console.log("Card Service initialized")
  }
}
