import { Component } from '@angular/core';
import { Card } from './card/card.component';

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
    new Tab("Встречи", [
      new Card("Собрание СД", "Собрание совета директоров", "21.10.2022 10:00", 0, 0),
      new Card("Планирование задач", "Планирование задач с командой", "21.10.2022 12:00", 0, 150)
    ]),
    new Tab("Задачи", [
      new Card("Маркетинг план", "Составить маркетинг план для Робота уборщика", "", 0, 0),
      new Card("Ответить на предложение", "Ответить на предложение фирмы \"Бытовые приборы\"", "", 0, 150)
    ]),
    new Tab("Разное", [])
  ]
}

