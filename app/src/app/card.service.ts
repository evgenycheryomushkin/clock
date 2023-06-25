import { Injectable } from '@angular/core';
import { WorkEvent } from './data/work-event';
import { EventHubService } from './event-hub.service';
import { Card } from './data/card';
import { Rectangle } from './data/rectangle';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private nextId: number = 1

  public cards = new Array<Card>()

  private y = 20

  constructor(eventHubService: EventHubService) { 
    const cardService = this;
    eventHubService.subscribe(WorkEvent.NEW_CARD_ALLOWED,
      () => {
        return new WorkEvent(WorkEvent.NEW_WITH_ID, WorkEvent.ID, ""+(cardService.nextId++))
      })

      eventHubService.subscribe(WorkEvent.NEW_WITH_BOUNDING_RECT,
        (event: WorkEvent) => {
          const id = +event.data.get(WorkEvent.ID)
          const rect: Rectangle = JSON.parse(event.data.get(WorkEvent.BOUNDING_RECT))

          cardService.cards.push(new Card(
            id, "", "", (new Date()).toString(), { x: Math.min(600, rect.x + rect.w - 200), y: cardService.getNewY() + rect.y }
          ))
        })
    }

    init() {
      console.log("Card Service initialized")
    }  

    getNewY() {
      return this.y += 20
    }
  }
