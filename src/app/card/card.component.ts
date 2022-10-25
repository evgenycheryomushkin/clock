import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CdkDragEnd, CdkDragStart, CdkDragMove, Point, CdkDragDrop } from '@angular/cdk/drag-drop';


export class Card {
  name: String
  description: String
  time: String
  position: Point
  edit: boolean
  constructor(name: String, description: String, time:String, x: number, y: number, edit:boolean = false) {
    this.name = name;
    this.description = description;
    this.time = time;
    this.position = {x:x, y:y};
    this.edit = edit;
  }
}

export class CardEvent extends Event {
}

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  @Input() card: Card = new Card("Test", "description", "", 0, 0)
  @Output() cardEvent = new EventEmitter<CardEvent>();
    dragEnabled: boolean = true

  constructor() {
  }

  ngOnInit(): void {
  }


  dragStarted(event: CdkDragStart) {
    console.log('dragStarted');
  }


  dragEnded(event: CdkDragEnd) {
    this.card.position = event.source.getFreeDragPosition();
    console.log('dragEnded ' + this.card.position.x + " " + this.card.position.y);
  }

  onEditClick() {
    this.card.edit = true
    this.cardEvent.emit(new CardEvent("EDIT"));
    console.log("edit")
  }
  onSaveClick() {
    this.card.edit = false
    this.cardEvent.emit(new CardEvent("SAVE"));
    console.log("save")
  }
  onDoneClick() {
    this.cardEvent.emit(new CardEvent("DONE"));
  }
}