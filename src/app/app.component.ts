import { Component, ViewChild } from '@angular/core';
import { filter, fromEvent, map, Observable } from 'rxjs';
import { CardService } from './card.service';
import { Card } from './card/card.component';
import { AppEvent } from './card/event/app-event';
import { CardEvent } from './card/event/card-event';
import { CardServiceEvent } from './card/event/card-service-event';
import { WorkEvent } from './card/event/work-event';
import { EventHubService, EventSubscriber } from './event-hub.service';


export class Tab {
  name: String
  cards: Array<Card>
  constructor(name: String, cards: Array<Card>) {
    this.name = name;
    this.cards = cards;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('appElement') appElement: any; 
  
  focusTab = new Tab("FOCUS", []);
  tabs = [
    this.focusTab,    
    new Tab("DONE", [])
  ]
  isEditing: boolean = false
  newCardPosY = 0
  keyDown: any
  newCardSubscriber: EventSubscriber | undefined
  editCardSubscriber: EventSubscriber | undefined
  keyboardEventObserver: Observable<WorkEvent> | undefined;
  private editAnyCard = false;

  constructor(private eventHubService:EventHubService,
    private cardService:CardService) {
      eventHubService.init();
      cardService.init();
    }

  ngOnInit(): void {
    const appComponent = this;
    this.keyboardEventObserver = fromEvent<KeyboardEvent>(document, 'keydown')
                    .pipe(filter(e => !appComponent.editAnyCard && e.code == 'KeyN'),
                          map((event: KeyboardEvent) => new AppEvent(AppEvent.NEW_CARD, 0)));
    this.eventHubService.registerSource(this.keyboardEventObserver)

    this.newCardSubscriber = new class extends EventSubscriber {
        constructor() {
          super();
          this.next = (workEvent:WorkEvent) => {
            if (workEvent.type == CardServiceEvent.NEW_ID) {
              const id = (workEvent as CardServiceEvent).id;
              const newCard = new Card(id, "", "", "", 750, 20+50*appComponent.getNewCardPosY());
              newCard.edit = true;
              appComponent.editAnyCard = true;
              appComponent.tabs[0].cards.push(newCard);
            }
          }
        }
     };
     this.eventHubService.sourceSream.register(this.newCardSubscriber)
  }
  
  process(cardEvent:CardEvent) {
    const appComponent = this;
    if (cardEvent.type == CardEvent.EDIT && !this.editAnyCard) {
      appComponent.tabs[0].cards.forEach((card:Card) => {
        if (card.id == cardEvent.cardId) {
          appComponent.editAnyCard = true;
          card.edit = true;
        }
      });
    }
    if (cardEvent.type == CardEvent.SAVE) {
      appComponent.tabs[0].cards.forEach((card:Card) => {
        if (card.id == cardEvent.cardId) {
          appComponent.editAnyCard = false;
          card.edit = false;
        }
      });
    }
    this.editCardSubscriber?.emit(cardEvent);
  }

  getNewCardPosY():number {
    return this.newCardPosY++;
  }
}
