import { Component, Input, Output, EventEmitter, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { CdkDragEnd, CdkDragStart, Point } from '@angular/cdk/drag-drop';
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
export class CardComponent implements AfterViewInit {
  @Input() card: Card = new Card(0, "Test", "description", "", 0, 0)
  @Output() cardEvent = new EventEmitter<CardEvent>()
  dragEnabled: boolean = true

  @ViewChild("cardNameEdit", {static: false}) private cardNameEditRef: ElementRef<HTMLElement> | undefined;

  constructor() {
  }

  ngAfterViewInit() {
    this.cardNameEditRef?.nativeElement.focus();
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