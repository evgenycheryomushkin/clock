import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { filter, fromEvent, map, Observable, tap } from 'rxjs';
import { CardService } from './card.service';
import { WorkEvent } from './work-event';
import { EventHubService } from './event-hub.service';
import { EventProcessor } from './event-processor';
import { Card } from './card';
import { DOCUMENT } from '@angular/common';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('appElement') appElement: ElementRef;

  cards = new Array<Card>()

  keyboardEventObserver: Observable<WorkEvent>

  constructor(
    private eventHubService: EventHubService,
    cardService: CardService) 
  {
    eventHubService.init();
    cardService.init();
  }

  y = 20
  getNewY() {
    return this.y += 20
  }


  newCardEnabled = true
  ngOnInit(): void {
    const appComponent = this;
    this.keyboardEventObserver = fromEvent<KeyboardEvent>(document, 'keydown')
      .pipe(filter(e => e.code == 'KeyN'),
        tap(e => e.preventDefault()),
        map(() => new WorkEvent(WorkEvent.NEW_CARD))
      );
    this.eventHubService.registerSource(this.keyboardEventObserver)

    this.buildNewProcessor(appComponent)
    this.buildNewIdProcessor(appComponent)
    this.buildEditSaveProcessors(appComponent)

  }

  buildNewProcessor(appComponent: AppComponent) {
    appComponent.eventHubService.buildProcessor(WorkEvent.NEW_CARD,
      () => {
        if (appComponent.newCardEnabled) appComponent.eventHubService.emit(
          new WorkEvent(WorkEvent.NEW_CARD_ALLOWED)
        )
      })
    }

  buildEditSaveProcessors(appComponent: AppComponent) {
    appComponent.eventHubService.buildProcessor(WorkEvent.EDIT,
      () => {
        appComponent.newCardEnabled = false
      })
    appComponent.eventHubService.buildProcessor(WorkEvent.SAVE,
        () => {
          appComponent.newCardEnabled = true
          console.log("offsetTop", this.appElement.nativeElement.offsetTop)
        })
  }

  buildNewIdProcessor(appComponent: AppComponent) {
    appComponent.eventHubService.buildProcessor(WorkEvent.NEW_WITH_ID,
      (event: WorkEvent) => {
        const id = +event.data.get(WorkEvent.ID)
        const x = window.scrollX
        const y = window.scrollY
        const w = window.innerWidth
        const h = window.innerHeight
        console.log(x,y,w,h)
        appComponent.cards.push(new Card(
          id, "", "", (new Date()).toString(), { x: Math.min(600, x+w-200), y: appComponent.getNewY() + y }
        ))
      })
  }
}
