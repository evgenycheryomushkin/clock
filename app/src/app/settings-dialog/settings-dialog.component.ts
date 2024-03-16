import {Component, HostListener, OnInit} from '@angular/core';
import { EventHubService } from '../service/event-hub.service';
import { CardEvent } from '../data/card-event';
import {Point} from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.scss']
})
export class SettingsDialogComponent {

  public visible = false
  position: Point;

  constructor(
    eventHubService: EventHubService
  ) {
    this.position = {x:100, y: 100}
    const settingsDialog = this
    eventHubService.subscribe(CardEvent.SETTINGS_EVENT,
      () => {
        this.position = {
          x: window.pageXOffset + 50,
          y: window.pageYOffset + 50
        }
        settingsDialog.visible = !settingsDialog.visible

      }
    )
   }


   closeClick() {
    this.visible = false
   }
}
