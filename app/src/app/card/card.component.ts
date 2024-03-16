import { Component, Input, ViewChild, AfterViewInit, ElementRef, Renderer2 } from '@angular/core';
import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { EventHubService } from '../service/event-hub.service';
import { CardEvent } from '../data/card-event';
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
    this.card.position.x = event.dropPoint.x
    this.card.position.y = event.dropPoint.y
    this.dragging = false
    this.eventHub.emit(new CardEvent(
      CardEvent.UPDATE_CARD_EVENT,
      CardEvent.ID, this.card.id,
      CardEvent.CARD_X, ""+this.card.position.x.toFixed(),
      CardEvent.CARD_Y, ""+this.card.position.y.toFixed()
      ))
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
    this.eventHub.emit(new CardEvent(
      CardEvent.UPDATE_CARD_EVENT,
      CardEvent.ID, this.card.id,
      CardEvent.CARD_HEADER, this.card.header,
      CardEvent.CARD_DESCRIPTION, this.card.description,
      CardEvent.CARD_X, ""+this.card.position.x.toFixed(),
      CardEvent.CARD_Y, ""+this.card.position.y.toFixed()
      ));
  }

  /**
   * Done click. Closes card and moves it to "Done"
   * on backend.
   */
  onDoneClick() {
    if (!this.editing) {
      this.eventHub.emit(
        new CardEvent(CardEvent.DONE_CARD_EVENT,
          CardEvent.ID, this.card.id))
    }
  }
}
