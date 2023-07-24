import { Component, OnInit } from '@angular/core';
import { EventHubService } from '../service/event-hub.service';
import { WorkEvent } from '../data/work-event';
import { filter, fromEvent, map, tap } from 'rxjs';
import { AllowService } from '../service/allow.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  private newCardEnabled = true

  constructor(
    private eventHubService:EventHubService,
    private allowService: AllowService
    ) { }

  ngOnInit() {
    const addComponent = this
    this.buildNKeySource();
  }

  /**
   * Click on new card button
   */
  newCardClick() {
    if (this.allowService.startNewIdIfAllowed()) {
      this.eventHubService.emit(
        new WorkEvent(WorkEvent.ALLOW_ADD_EVENT));
    }
  }

  /**
   * Press N key
   */
  private buildNKeySource() {
    const addComponent = this
    const keyboardEventObserver = fromEvent<KeyboardEvent>(document, 'keydown')
      .pipe(filter(e => e.code == 'KeyN'),
        filter(e => addComponent.allowService.startNewIdIfAllowed()),
        tap(e => e.preventDefault()),
        map(() => new WorkEvent(WorkEvent.ALLOW_ADD_EVENT)
        ));
      addComponent.eventHubService.registerSource(keyboardEventObserver);
  }
}
