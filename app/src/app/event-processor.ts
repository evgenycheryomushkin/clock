import { Observer } from "rxjs"
import { WorkEvent } from "./work-event"
import { EventStream } from "./event-hub.service"

export class EventProcessor implements Observer<WorkEvent> {

    constructor(
      private nextValue: (value: WorkEvent, 
        eventSubscriber: EventProcessor) => void,
      public error: (err: any) => void,
      public complete: () => void,
      private eventStream: EventStream
       ) {
    }
  
    next: (value: WorkEvent) => void = (value: WorkEvent) => {
      this.nextValue(value, this)
    }
  
    emit(workEvent: WorkEvent) {
      this.eventStream.emit(workEvent)
    }  
  }
  