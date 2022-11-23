import { Component, HostListener, ViewChild } from '@angular/core';
import { filter, fromEvent, map } from 'rxjs';
import { Card } from './card/card.component';
import { AppEvent } from './card/event/app-event';
import { WorkEvent } from './card/event/work-event';
import { EventHubService } from './event-hub.service';

export class Tab {
  name: String
  cards: Array<Card>
  constructor(name: String, cards: Array<Card>) {
    this.name = name;
    this.cards = cards;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('appElement') appElement: any; 
  
  tabs = [
    new Tab("FOCUS", []),
    new Tab("DONE", [])
  ]
  isEditing: boolean = false
  newCardPosY = 0
  keyDown: any

  constructor(private eventHubService: EventHubService) {}

  ngOnInit(): void {
    const keyboardEventObserver = fromEvent<KeyboardEvent>(document, 'keydown')
                    .pipe(filter(e => e.code == 'KeyN'),
                          map((event: KeyboardEvent) => new AppEvent(AppEvent.NEW_CARD)));
    this.eventHubService.register(keyboardEventObserver)
  }
  


  @HostListener('window:keydown', ['$event'])
  onKeyDown(event:KeyboardEvent) {
    if (event.code == 'KeyN') {
    }
  }
  
  createCard() {
    this.tabs[0].cards.push(new Card(0, "", "", "", 750, 20+50*this.newCardPosY++));
    this.newEvent(new Event("EDIT"));
  }

  newEvent(event:WorkEvent) {
  }
}

