import { Component, OnInit } from '@angular/core';
import { EventHubService } from '../service/event-hub.service';
import { CardEvent } from '../data/card-event';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(
    private eventHubService:EventHubService
    ) { }


  ngOnInit(): void {
  }

  settingsClick() {
      this.eventHubService.emit(
        new CardEvent(CardEvent.SETTINGS_EVENT));
  }
  
}
