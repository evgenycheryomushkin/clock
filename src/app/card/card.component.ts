import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { CdkDragEnd, CdkDragStart, CdkDragMove, Point, CdkDragDrop } from '@angular/cdk/drag-drop';


export class Card {
  name: String
  description: String
  time: String
  position: Point
  constructor(name: String, description: String, time:String, x: number, y: number) {
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

  @Input() card: Card = new Card("Test", "description", "", 0, 0)
  editEnabled: boolean = false
  dragEnabled: boolean = false

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
    this.editEnabled = true
    console.log("edit")
  }
  onSaveClick() {
    this.editEnabled = false
    console.log("edit")
  }
}