import { Component, Input, ViewChild, AfterViewInit, ElementRef, AfterViewChecked, AfterContentChecked, OnChanges, Renderer2 } from '@angular/core';
import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { EventHubService } from '../service/event-hub.service';
import { WorkEvent } from '../data/work-event';
import { Card } from '../data/card';
import { AllowService } from '../service/allow.service';
import { Subscription, fromEvent } from 'rxjs';

/**
 * Card component. Manages a card. Allow editing card,
 * dragging card. Send UPDATE_CARD_EVENT when card is updated.
 * 
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

  // placing new card. Card follows mouse cursor
  // until user clicks mouse
  cardPlacing = false

  @ViewChild("cardElem", {read: ElementRef}) 
  private cardElem: ElementRef
  @ViewChild("cardHeaderEdit", {read: ElementRef}) 
  private cardHeaderEditRef: ElementRef

  lastRect: DOMRect | undefined = undefined

  constructor(
    private eventHub: EventHubService,
    public allowService: AllowService,
    private renderer: Renderer2) {
      // start placing new card
      // placing new card means that card
      // is stick to mouse cursor.
      // User moves mouse and place card. After 
      // click card is fixed
      this.cardPlacing = true
  }

  /**
   * Subscription to mouse move event. It is needed
   * when new card appears. Card is being dragged with
   * mouse. So card shuld follow mouse coordinates
   * without click.
   * After click it will be unsubscribed and not be
   * clicked anymore.
   */
  private startingMouseMoveSubscription: Subscription

  ngAfterViewInit() {
    const cardComponent = this

    /**
     * Subscribe to mouse move event. We stick card to mouse move.
     * After click card is placed and edit mode turns on
     */
    this.startingMouseMoveSubscription = fromEvent(document.body, 'mousemove').subscribe((e) => {
      if (e instanceof MouseEvent) {
        cardComponent.card.position = {x: e.pageX-20, y: e.pageY-20}
        console.log(e)
      }
    })
  }

  /**
   * Mouse click event. Needed for new card drag 
   * When new card is dragged - it is dragged
   * without mouse press. It will finish dragging
   * after mouse click.
   */
  mouseClick() {
    if (this.cardPlacing) {
      this.cardPlacing = false
      this.startingMouseMoveSubscription.unsubscribe()
      this.allowService.switchNewEdit()
      this.editing = true
    }
  }

  /**
   * Event when ral drag is started.
   * dragging flag elevates card.
   */
  dragStarted() {
    this.dragging = true
  }

  dragEnded(event: CdkDragEnd) {
    this.dragging = false
    // todo check that this position is working
    this.card.position = event.source.getFreeDragPosition();
    this.eventHub.emit(new WorkEvent(
      WorkEvent.UPDATE_CARD_EVENT, WorkEvent.CARD, JSON.stringify(this.card)))
  }

  onEditClick() {
    if (this.allowService.startEditIfAllowed()) {
      this.editing = true
    }
  }

  onSaveClick() {
    this.allowService.endEdit()
    this.editing = false
    this.eventHub.emit(new WorkEvent(
      WorkEvent.UPDATE_CARD_EVENT, WorkEvent.CARD, JSON.stringify(this.card)))
  }

  onDoneClick() {
    this.eventHub.emit(
      new WorkEvent(WorkEvent.DONE_CARD_EVENT, 
        WorkEvent.ID, this.card.id))
  }
}