import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventHubService } from '../event-hub.service';
import { CardService } from '../card.service';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    EventHubService,
    CardService
  ]
})
export class CoreModule { }
