import { Component, HostListener } from '@angular/core';
import { Card, CardEvent } from './card/card.component';

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
  tabs = [
    new Tab("FOCUS", []),
    new Tab("DONE", [])
  ]
  isEditing: boolean = false
  newCardPosY = 0

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event:KeyboardEvent) {
    if (event.code == 'KeyN') {
      this.newEvent(new Event("KeyN"));
    }
  }
  
  createCard() {
    this.tabs[0].cards.push(new Card("", "", "", 750, 20+50*this.newCardPosY++, true));
    this.newEvent(new Event("EDIT"));
  }

  newEvent(event:Event) {
    console.log("Event:", event);
    if (event.type == 'KeyN' && !this.isEditing) {
      this.newEvent(new Event("NEW"));
    }
    if (event.type == "EDIT") this.isEditing = true;
    if (event.type == "SAVE") this.isEditing = false;
    if (event.type == "NEW") this.createCard();
  }
}

