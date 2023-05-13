import { Component, Input, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { EventHubService } from '../event-hub.service';
import { WorkEvent } from '../work-event';
import { Card } from '../card';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements AfterViewInit {
  @Input() card: Card
  
  dragEnabled = true

  // true when card is dragged
  dragging = false

  // flag that card can be edited
  editEnabled = true

  // flag that switch interface into edit mode
  editing = false

  @ViewChild("cardHeaderEdit", {static: false}) private cardHeaderEditRef: ElementRef<HTMLElement> | undefined;

  constructor(private eventHub: EventHubService) {
  }

  ngAfterViewInit() {
    const cardComponent = this
    this.cardHeaderEditRef?.nativeElement.focus();
    this.buildEditProcessor(cardComponent)
    this.buildSaveProcessor(cardComponent)
  }

  buildSaveProcessor(cardComponent: CardComponent) {
    this.eventHub.buildProcessor(
      WorkEvent.EDIT,
      (event: WorkEvent) => {
        if (event.data.get(WorkEvent.ID) == cardComponent.card.id) {
          cardComponent.editing = true
          cardComponent.dragEnabled = false
        } 
        cardComponent.editEnabled = false
      }
    )
  }

  buildEditProcessor(cardComponent: CardComponent) {
    this.eventHub.buildProcessor(
      WorkEvent.SAVE,
      (event: WorkEvent) => {
        if (event.data.get(WorkEvent.ID) == cardComponent.card.id) {
          cardComponent.editing = false
          cardComponent.dragEnabled = true
        } 
        cardComponent.editEnabled = true
      }
    )
  }

  dragStarted() {
    this.dragging = true
    const workEvent = new WorkEvent(WorkEvent.DRAG_START, WorkEvent.ID, this.card.id)
    this.eventHub.emit(workEvent)
  }

  dragEnded(event: CdkDragEnd) {
    this.dragging = false
    // todo check that this position is working
    this.card.position = event.source.getFreeDragPosition();
    this.eventHub.emit(
      new WorkEvent(
          WorkEvent.DRAG_END, 
          WorkEvent.ID, this.card.id, 
          WorkEvent.POS, this.card.position))
  }

  onEditClick() {
    if (this.editEnabled)
      this.eventHub.emit(
        new WorkEvent(WorkEvent.EDIT, 
          WorkEvent.ID, this.card.id))
  }
  onSaveClick() {
    this.eventHub.emit(new WorkEvent(
      WorkEvent.SAVE, 
      WorkEvent.ID, this.card.id, 
      WorkEvent.HEADER, this.card.header, 
      WorkEvent.DESCRIPTION, this.card.description))
  }
  onDoneClick() {
    this.eventHub.emit(
      new WorkEvent(WorkEvent.DONE, 
        WorkEvent.ID, this.card.id))
  }
}