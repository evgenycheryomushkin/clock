import { Component } from '@angular/core';
import { Card } from './card/card.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  cards = [
    new Card("Test1", "Description1", 0, 0),
    new Card("Test2", "Description2", 150, 0),
    new Card("Test3", "Description3", 300, 0)
  ]
}

