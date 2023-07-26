import { Injectable } from "@angular/core";
import { EventHubService } from "./event-hub.service";
import { WorkEvent } from "../data/work-event";


/**
 * Allow service should be asked:
 * if new card allowed,
 * if edit card allowed,
 * if drag allowed.
 * 
 * And it should be notified:
 * if new card is being creating,
 * if card is being edited,
 * if card is being dragged.
 * if new card is finished creating,
 * if card is being finished editing,
 * if card is being finished dragging.
 */
@Injectable({providedIn: 'root'})
export class AllowService {
  /**
   * True if drag is allowed in given moment, 
   * false dragging is not allowed in given moment
   */
  public dragEnabled: boolean = true

  /**
   * New card is creating flag. True if new card is being creating,
   * false otherwise. Only one new card can be emmited at time.
   * New card is placed (dragging by mouse without pressing button).
   * Then after click, automatically turns to edit mode.
   * New card is not allowed while editing or dragging.
   */
  private new: boolean = false

  /**
   * Editing flag. True if card is being edited,
   * false otherwise. Only one card can be edited at a time.
   * During editing new card is not allowed, drag is not allowed.
   */
  private edit: boolean = false

  /**
   * True if card is being dragged.
   * Dragging is not allowed while editing or new.
   */
  private drag: boolean = false
  
  constructor(
    private eventHub: EventHubService) {
  }


  /**
   * Start adding new card if it is allowed. After passing new
   * card event new card adding is not allowed until
   * it will be editing. New card is not allowed
   * during dragging, editing.
   * @returns true is new card is started,
   * false if adding new card is not allowed
   */
  startNewIdIfAllowed() {
    if (!this.new && !this.edit && !this.drag) {
      this.startNew()
      return true;
    } else {
      return false;
    }
  }

  /**
   * Start edit new card if allowed. Card editing is allowed 
   * if another card is not edited, new or dragged this time. 
   * @returns true if card editing is started, false
   * if card editing is not allowed
   */
  startEditIfAllowed() {
    if (!this.new && !this.edit && !this.drag) {
      this.startEdit() 
      return true;
    } else {
      return false;
    }
  }

  /**
   * Start drag if it is allowed. Dragging is allowed if another card
   * is not being creating? editing or dragging in this time.
   * @returns true if card dragging is allowed, false otherwise.
   */
  startDragIfAllowed() {
    if (!this.new && !this.edit && !this.drag) {
      this.startDrag()
      return true;
    } else {
      return false;
    }
  }

  /**
   * Switch from new to edit
   */
  switchNewEdit() {
    this.new = false
    this.edit = true
  }

  /**
   * End adding new card
   */
  endNew() {
    this.new = false
    this.setDragEnabled()
  }

  /**
   * End editing new card
   */
  endEdit() {
    this.edit = false
    this.setDragEnabled()
  }

  /**
   * End dragging new card
   */
  endDrag() {
    this.drag = false
    this.setDragEnabled()
  }

  /**
   * Start creating new card
   */
  startNew() {
    this.setDragDisabled()
    this.new = true
  }

  /**
   * Start edit card
   */
  startEdit() {
    this.setDragDisabled()
    this.edit = true
  }

  /**
   * Start drag card
   */
  startDrag() {
    this.setDragDisabled()
    this.drag = true
  }

  /**
   * Set drag enabled flag
   */
  setDragEnabled() {
    this.dragEnabled = true
  }

  /**
   * Unset drag enabled flag
   */
  setDragDisabled() {
    this.dragEnabled = false
  }

  init() {
    console.log("Allow Service initialized")
  }
}