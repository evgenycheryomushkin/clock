import { Observer } from "rxjs"
import { CardEvent } from "../data/card-event"
import { EventStream } from "../service/event-hub.service"

/**
 * Processor that can process event and output another event(s), 
 * if necessary. To process events nextValue function should be used. 
 * 
 * It should be used via EventHubService like this:
 * this.eventHub.subscribe(
      WorkEvent.EDIT,
      (event: WorkEvent) => {
        const newEvent = WorkEvent(WorkEvent.TYPE, key1, value1, key2, value2)
        return newEvent
      }
    )
 * 
 * If you need to output several events than eventProcessor parameter
 * should be used: eventProcessor.emit(event) If you don't need to emit any value, 
 * just subscribe to event, then do not return any value. 
 * If you want to output single event, then return WorkEvent.
 * 
 * EventProcessor should not be instantiated directly, 
 * it should be instantiated via EventHubService.buildProcessor
 */
export class EventProcessor implements Observer<CardEvent> {

  constructor(
    private nextValue: (value: CardEvent,
      eventProcessor: EventProcessor) => CardEvent | void,
    public error: (err: any) => void,
    public complete: () => void,
    private eventStream: EventStream
  ) {
  }

  next: (value: CardEvent) => void = (value: CardEvent) => {
    const resEvent = this.nextValue(value, this)
    if (resEvent != null) this.emit(resEvent)
  }

  emit(workEvent: CardEvent) {
    this.eventStream.emit(workEvent)
  }
}
