import { Component, OnInit } from '@angular/core';
import { EventHubService, EventProcessor } from '../event-hub.service';
import { WorkEvent } from '../work-event';
import { CardServiceEvent } from '../card/event/card-service-event';
import { Card } from '../card/card.component';

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
