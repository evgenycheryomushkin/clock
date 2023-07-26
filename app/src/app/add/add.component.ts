import { Component, OnInit } from '@angular/core';
import { EventHubService } from '../service/event-hub.service';
import { WorkEvent } from '../data/work-event';
import { filter, fromEvent, map, tap } from 'rxjs';
import { AllowService } from '../service/allow.service';

/**
 * Add component. Add new card button. Material
 * FAB button with plus sign.
 */
@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  /**
   * Creates add button component
   * @param eventHubService event hub service. Allows sending new message
   * and subscribe to messages
   * @param allowService allow service checks that new card can be added,
   * edit card is allowed and draging card is allowed
   */
  constructor(
    private eventHubService:EventHubService,
    private allowService: AllowService
    ) { }

  ngOnInit() {
    const addComponent = this
    this.buildNKeySource();
  }

  /**
   * Click on new card button. If start new
   * card is allowed then send ALLOW_ADD_EVENT
   */
  newCardClick() {
    if (this.allowService.startNewIdIfAllowed()) {
      this.eventHubService.emit(
        new WorkEvent(WorkEvent.ALLOW_ADD_EVENT));
    }
  }

  /**
   * Press N key. If new card is allowed - sends
   * ALLOW_ADD_EVENT event
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
