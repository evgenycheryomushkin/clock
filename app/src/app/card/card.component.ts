import { Component, Input, ViewChild, AfterViewInit, ElementRef, Renderer2 } from '@angular/core';
import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { EventHubService } from '../service/event-hub.service';
import { WorkEvent } from '../data/work-event';
import { Card } from '../data/card';
import { AllowService } from '../service/allow.service';

/**
 * Card component. Manages a card. Allow editing card,
 * dragging card. Send UPDATE_CARD_EVENT when card is updated.
 */
@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements AfterViewInit {
  @Input() card: Card
  
  // true when card is dragged
  dragging = false

  // flag that switch interface into edit mode
  editing = false

  @ViewChild("cardElem", {read: ElementRef}) 
  private cardElem: ElementRef
  @ViewChild("cardHeaderEdit", {read: ElementRef}) 
  private cardHeaderEditRef: ElementRef

  constructor(
    private eventHub: EventHubService,
    public allowService: AllowService,
    private renderer: Renderer2) {
  }

  ngAfterViewInit() {
    console.log(this.card)
    this.card.cardComponent = this
  }

  /**
   * Gets card bounding rect
   * @returns card bounding rectangle
   */
  getBoundingRect(): DOMRect {
    return this.cardElem.nativeElement.getBoundingClientRect()        
  }

  /**
   * Event when drag is started.
   * dragging flag elevates card.
   */
  dragStarted() {
    this.dragging = true
  }

  /**
   * End drag event
   * @param event event with new coordinates etc
   */
  dragEnded(event: CdkDragEnd) {
    this.dragging = false
    this.eventHub.emit(new WorkEvent(
      WorkEvent.UPDATE_CARD_EVENT, WorkEvent.CARD, JSON.stringify(this.card)))
  }

  /**
   * Edit click listener. Turns card to edit mode.
   */
  onEditClick() {
    if (this.allowService.startEditIfAllowed()) {
      this.editing = true
    }
  }

  /**
   * Save click listener. Saves card content to backend,
   * turns card from edit mode to normal mode
   */
  onSaveClick() {
    this.allowService.endEdit()
    this.editing = false
    this.eventHub.emit(new WorkEvent(
      WorkEvent.UPDATE_CARD_EVENT, WorkEvent.CARD, JSON.stringify(this.card)))
  }

  /**
   * Done click. Closes card and moves it to "Done"
   * on backend.
   */
  onDoneClick() {
    this.eventHub.emit(
      new WorkEvent(WorkEvent.DONE_CARD_EVENT, 
        WorkEvent.ID, this.card.id))
  }
}