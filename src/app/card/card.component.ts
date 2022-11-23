import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CdkDragEnd, CdkDragStart, CdkDragMove, Point, CdkDragDrop } from '@angular/cdk/drag-drop';
import { WorkEvent } from './event/work-event';
import { CardEvent } from './event/card-event';


export class Card {
  id: number
  name: String
  description: String
  time: String
  position: Point
  edit: boolean = false
  constructor(id: number, name: String, description: String, time:String, x: number, y: number) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.time = time;
    this.position = {x:x, y:y};
  }
}

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @ViewChild('cardElement') cardElement: any; 
  @Input() card: Card = new Card(0, "Test", "description", "", 0, 0)
  @Output() cardEvent = new EventEmitter<CardEvent>()
  dragEnabled: boolean = true

  constructor() {
  }

  ngOnInit(): void {
    this.cardElement.changes.subscribe((changes: any) => 
    console.log(changes));
  }


  dragStarted(event: CdkDragStart) {
    this.cardEvent.emit(new CardEvent(CardEvent.DRAG_START, this.card.id))
  }


  dragEnded(event: CdkDragEnd) {
    this.card.position = event.source.getFreeDragPosition();
  }

  onEditClick() {
    this.cardEvent.emit(new CardEvent(CardEvent.EDIT, this.card.id));
  }
  onSaveClick() {
    this.cardEvent.emit(new CardEvent(CardEvent.SAVE, this.card.id));
  }
  onDoneClick() {
    this.cardEvent.emit(new CardEvent(CardEvent.DONE, this.card.id));
  }
}