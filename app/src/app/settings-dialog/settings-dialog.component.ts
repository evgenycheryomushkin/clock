import { Component, OnInit } from '@angular/core';
import { EventHubService } from '../service/event-hub.service';
import { CardEvent } from '../data/card-event';

@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.scss']
})
export class SettingsDialogComponent {

  public visible = false

  constructor(
    eventHubService: EventHubService
  ) {
    const settingsDialog = this
    eventHubService.subscribe(CardEvent.SETTINGS_EVENT,
      () => {
        console.log("settings visible")
          settingsDialog.visible = true
      }
    )
   }


   closeClick() {
    this.visible = false
   }
}
