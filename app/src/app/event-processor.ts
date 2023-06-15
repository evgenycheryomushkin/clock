import { Observer } from "rxjs"
import { WorkEvent } from "./data/work-event"
import { EventStream } from "./event-hub.service"

export class EventProcessor implements Observer<WorkEvent> {

  constructor(
    private nextValue: (value: WorkEvent,
      eventSubscriber: EventProcessor) => WorkEvent | void,
    public error: (err: any) => void,
    public complete: () => void,
    private eventStream: EventStream
  ) {
  }

  next: (value: WorkEvent) => void = (value: WorkEvent) => {
    const resEvent = this.nextValue(value, this)
    if (resEvent != null) this.emit(resEvent)
  }

  emit(workEvent: WorkEvent) {
    this.eventStream.emit(workEvent)
  }
}
