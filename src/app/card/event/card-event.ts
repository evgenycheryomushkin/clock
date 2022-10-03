import { WorkEvent } from "./work-event";

export class CardEvent extends WorkEvent {

  cardId: number;
  static DRAG_START: string = "CARD_DRAG_START";
  static EDIT: string = "CARD_EDIT";
  static SAVE: string = "CARD_SAVE";
  static DONE: string = "CARD_DONE";
    constructor(type: string, cardId: number) {
      super(type);
      this.cardId = cardId;
    }
  }
  