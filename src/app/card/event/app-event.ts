import { WorkEvent } from "./work-event";

export class AppEvent extends WorkEvent {
  id: number;
  static NEW_CARD: string = "APP_NEW_CARD";
  static EDIT_CARD: string = "APP_EDIT_CARD";

  constructor(type: string, id: number) {
    super(type);
    this.id = id;
  }
}