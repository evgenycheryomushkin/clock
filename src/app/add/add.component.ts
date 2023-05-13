import { Component } from '@angular/core';
import { EventHubService } from '../event-hub.service';
import { WorkEvent } from '../work-event';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent {

  constructor(private eventHubService:EventHubService) { }

  newCardClick() {
      this.eventHubService.emit(
        new WorkEvent(WorkEvent.NEW_CARD));
  }
}
