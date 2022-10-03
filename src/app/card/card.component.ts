import { Component, OnInit, Input } from '@angular/core';

export class Card {
  name: String
  description: String
  x: number
  y: number
  constructor(name: String, description: String, x: number, y: number) {
    this.name = name;
    this.description = description;
    this.x = x
    this.y = y
  }
}

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  @Input() card: Card = new Card("Test", "description", 0, 0)

  constructor() {
  }

  ngOnInit(): void {
  }

  onMouseUp(e:any): void {
    console.log("mouse up")
  }

}
