import { Component, OnInit } from '@angular/core';
import { EventHubService } from '../event-hub.service';
import { WorkEvent } from '../data/work-event';
import { filter, fromEvent, map, tap } from 'rxjs';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  private newCardEnabled = true

  constructor(private eventHubService:EventHubService) { }

  ngOnInit() {
    const addComponent = this
    this.buildNKeySource();
    this.buildNewProcessor(addComponent)
    this.buildEditSaveProcessors(addComponent)
  }

  newCardClick() {
      this.eventHubService.emit(
        new WorkEvent(WorkEvent.NEW_CARD));
  }

  private buildNKeySource() {
    const keyboardEventObserver = fromEvent<KeyboardEvent>(document, 'keydown')
      .pipe(filter(e => e.code == 'KeyN'),
        tap(e => e.preventDefault()),
        map(() => new WorkEvent(WorkEvent.NEW_CARD)
        )
      );
    this.eventHubService.registerSource(keyboardEventObserver);
  }

  buildNewProcessor(addComponent: AddComponent) {
    addComponent.eventHubService.buildProcessor(WorkEvent.NEW_CARD,
      () => {
        if (addComponent.newCardEnabled) 
          return new WorkEvent(WorkEvent.NEW_CARD_ALLOWED)
        else 
          return undefined
      })
  }

  buildEditSaveProcessors(appComponent: AddComponent) {
    appComponent.eventHubService.buildProcessor(WorkEvent.EDIT,
      () => {
        appComponent.newCardEnabled = false
      })
    appComponent.eventHubService.buildProcessor(WorkEvent.SAVE,
      () => {
        appComponent.newCardEnabled = true
      })
  }
}
