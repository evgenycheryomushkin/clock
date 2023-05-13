export class WorkEvent {

  public data: Map<string, any>;

  static EDIT        = "EDIT_EVENT";
  static SAVE        = "SAVE_EVENT";
  static DONE        = "DONE_EVENT";
  static DRAG_START  = "DRAG_START_EVENT";
  static DRAG_END    = "DRAG_END_EVENT";
  static NEW_CARD    = "NEW_CARD_EVENT";
  static NEW_WITH_ID = "NEW_CARD_WITH_ID_EVENT";
  
  static ID          = "ID_FIELD";
  static POS         = "POS_FIELD";
  static HEADER      = "HEADER_FIELD";
  static DESCRIPTION = "DESCRIPTION_FIELD";
  
  constructor(
    public type: string,
    ...args: any[]
    ) {
        this.data = new Map<string, any>()
        for(var i = 0; i < args.length; i +=2) {
            this.data.set(args[i], args[i+1])
        }
  }    
}