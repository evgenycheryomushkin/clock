import { Component, ViewChild } from '@angular/core';
import { filter, fromEvent, map, Observable, tap } from 'rxjs';
import { CardService } from './card.service';
import { WorkEvent } from './work-event';
import { EventHubService } from './event-hub.service';
import { EventProcessor } from './event-processor';
import { Card } from './card';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('appElement') appElement: any;

  cards = new Array<Card>()

  keyboardEventObserver: Observable<WorkEvent>

  constructor(private eventHubService: EventHubService,
    cardService: CardService) {
    eventHubService.init();
    cardService.init();
  }

  y = 20
  getNewY() {
    return this.y += 20
  }

  ngOnInit(): void {
    const appComponent = this;
    this.keyboardEventObserver = fromEvent<KeyboardEvent>(document, 'keydown')
      .pipe(filter(e => e.code == 'KeyN'),
        tap(e => e.preventDefault()),
        map(() => new WorkEvent(WorkEvent.NEW_CARD))
      );
    this.eventHubService.registerSource(this.keyboardEventObserver)

    this.eventHubService.buildProcessor(WorkEvent.NEW_WITH_ID,
      (event: WorkEvent, eventProcessor: EventProcessor) => {
        const id = event.data.get(WorkEvent.ID)
        appComponent.cards.push(new Card(
          id, "", "", (new Date()).toString(), { x: 600, y: appComponent.getNewY() }
        ))
        eventProcessor.emit(new WorkEvent(WorkEvent.EDIT, WorkEvent.ID, id))
      })
  }
}
