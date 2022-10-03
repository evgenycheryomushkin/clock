import { WorkEvent } from "./work-event";

export class CardServiceEvent extends WorkEvent {
  static NEW_ID: string = "CARD_SERVICE_NEW_ID";
  id: number = -1;
}