import { TSMap } from "typescript-map";

export class WorkEvent {

  /**
   * New card events
   */

  /**
   * Add new card event. New card is allowed to be added.
   * New card button is pressed. After that allow service is 
   * checked. If allow service allow adding new card, this event occurs.
   * Sender: add.component
   * Receiver: card.service
   */
  static ALLOW_ADD_EVENT = "ALLOW_ADD_EVENT";
  
  /**
   * Event: Get new card Id from backend
   * Parameters: none
   * Sender: card.service
   * 
   * Sent when new card event come to card.service. Card service
   * requests new id from backend. Session key will be added in 
   * routing service to this event to send it to backend.
   */
  static CARD_GET_ID_EVENT = "CARD_GET_ID_EVENT"


  /**
   * Navigation events
   * Event: End user navigation
   * Parameters: SESSION_KEY - session key
   * Sender: app.component
   * 
   * Called when user enter URL in browser. URL can contain
   * session key (16 hex digits number). URL is in form 
   * worktask.io/key . URL may not contain key: worktask.io
   * In this case session is new. We obtain new session from 
   * server and redirect to URL worktask.io/new_key
   */
  static APP_NAVIGATION_END_EVENT = "APP_NAVIGATION_END_EVENT"
  static SESSION_KEY = "SESSION_KEY"

  /**
   * Sent when UI is started.
   * Event: UI is sent to backend when UI is started. User
   * enter url in browser.
   * Parameters: SESSION_KEY - session key. Can be empty or
   * contain 16 hex digits.
   * Sender: backend.service
   * 
   * Sent to backend when UI starts. Contains session key or empty
   * for new session. When user first time enter the site. New key
   * is obtained and UI is redirected.
   */
  static UI_START_EVENT = "UI_START_EVENT"

  /**
   * Update card event. Sent when card is saved
   * or when card is finished dragging.
   * Parameters: CARD - json card to save
   * Sender: card.component
   * Receiver: Backend
   * 
   * Send card information to backend
   */
  static UPDATE_CARD_EVENT = "UPDATE_CARD_EVENT"
  static CARD = "CARD"

  /**
   * Sent when drag start to be enabled
   * Sender: allow.service
   * Receiver: card.component
   */
  static DRAG_ENABLED_EVENT = "DRAG_ENABLED_EVENT"

  /**
   * Sent when drag start to be disabled
   * Sender: allow.service
   * Receiver: card.component
   */
  static DRAG_DISABLED_EVENT = "DRAG_DISABLED_EVENT"

  /**
   * Event with new key from backend. Sent when new backend key 
   * is generated.
   * 
   * Frontend use first time enters UI. Then backend receives UI_START_EVENT.
   * Backend generates new key and sent BACKEND_NEW_KEY_EVENT to frontend. 
   * 
   * Sender: Backend
   * Receiver: routing.service
   * Parameters: SESSION_KEY - session key
   */
  static BACKEND_NEW_KEY_EVENT = "BACKEND_NEW_KEY_EVENT"

  /**
   * Generated on backend. Send new card key to frontend.
   * 
   * Sender: backend
   * Receiver: card.service
   * Parameters: ID - new card id
   */
  static BACKEND_NEW_ID_EVENT = "BACKEND_NEW_ID_EVENT";

  static EDIT        = "EDIT_EVENT";
  static SAVE        = "SAVE_EVENT";
  static DONE        = "DONE_EVENT";
  static DRAG_START  = "DRAG_START_EVENT";
  static DRAG_END    = "DRAG_END_EVENT";
  static NEW_CARD    = "NEW_CARD_EVENT";
  static NEW_CARD_ALLOWED    = "NEW_CARD_ALLOWED_EVENT";
  static NEW_WITH_ID = "NEW_CARD_WITH_ID_EVENT";
  static NEW_WITH_BOUNDING_RECT = "NEW_WITH_BOUNDING_RECT_EVENT";

  static BACKEND_INIT = "BACKEND_INIT";
  
  static ID          = "ID_FIELD";
  static POS         = "POS_FIELD";
  static HEADER      = "HEADER_FIELD";
  static DESCRIPTION = "DESCRIPTION_FIELD";
  static KEY         = "KEY_FIELD";
  static VIEWPORT    = "VIEWPORT_FIELD";
  static BOUNDING_RECT = "BOUNDING_RECT";
 
  public type: string;
  public dateTime: Date;
  public data: TSMap<string, string>;

  constructor(
    type: string,
    ...args: string[] | WorkEvent[]
    ) {
        this.type = type
        this.dateTime = new Date()
        this.data = new TSMap<string, any>()
        if (args.length == 0) return
        if (args[0] instanceof WorkEvent) {
          const event = args[0]
          event.data.forEach(
            (value: string, key?: string) => {
              if (key) this.data.set(key, value)
            })
        } else {
          for(var i = 0; i < args.length; i +=2) {
            this.data.set(args[i] as string, args[i+1] as string)
          }
        }
  }
}