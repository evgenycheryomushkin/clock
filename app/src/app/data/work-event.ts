import { TSMap } from "typescript-map";

export class WorkEvent {

  public type: string;
  public dateTime: Date;
  public data: TSMap<string, string>;

  static EDIT        = "EDIT_EVENT";
  static SAVE        = "SAVE_EVENT";
  static DONE        = "DONE_EVENT";
  static DRAG_START  = "DRAG_START_EVENT";
  static DRAG_END    = "DRAG_END_EVENT";
  static NEW_CARD    = "NEW_CARD_EVENT";
  static NEW_CARD_ALLOWED    = "NEW_CARD_ALLOWED_EVENT";
  static NEW_WITH_ID = "NEW_CARD_WITH_ID_EVENT";
  static NEW_WITH_BOUNDING_RECT = "NEW_WITH_BOUNDING_RECT_EVENT";
  static KEY_EVENT   = "KEY_EVENT";
  
  static ID          = "ID_FIELD";
  static POS         = "POS_FIELD";
  static HEADER      = "HEADER_FIELD";
  static DESCRIPTION = "DESCRIPTION_FIELD";
  static KEY         = "KEY_FIELD";
  static VIEWPORT    = "VIEWPORT_FIELD";
  static BOUNDING_RECT = "BOUNDING_RECT";
  
  constructor(
    type: string,
    ...args: string[]
    ) {
        this.type = type
        this.dateTime = new Date()
        this.data = new TSMap<string, any>()
        for(var i = 0; i < args.length; i +=2) {
            this.data.set(args[i], args[i+1])
        }
  }    
}