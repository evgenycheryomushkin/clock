import { Injectable } from '@angular/core';
import { CardEvent } from '../data/card-event';
import { Observable } from 'rxjs';
import { EventProcessor } from '../core/event-processor';

/**
 * EventHubService provides 3 methods to process events:
 * registerSource - register source of events,
 * emit - emit single event,
 * subscribe - subscribe to events.
 */
@Injectable({
  providedIn: 'root'
})
export class EventHubService {
  private sourceSream: EventStream = new EventStream()

  init() {
    console.log("Event Hub Service initialized")
  }

  constructor() {
    // log all events for debug purposes
    // this.subscribe(
    //   RegExp(".*"),
    //   (event: CardEvent) => {
    //       console.log(event.type, event)
    //   })
    }

  registerSource(observable: Observable<CardEvent>) {
    observable.subscribe(
      next => this.sourceSream.emit(next)
    )
  }

  emit(workEvent: CardEvent) {
    this.sourceSream.emit(workEvent)
  }

  /**
   * Subscribe to event of type eventType and emit result.
   * @param eventType type of event. Can be set using regex or
   * string. If it is set using regex, processor is subscribed to
   * every event that satisfy this regex. If eventType is string,
   * then processor subscribes to event with this name.
   * @param next function that is called when next event occur. Contains
   * two parameters:
   * WorkEvent - event that is passed and
   * EventProcessor - this processor that is being build.
   * eventProcessor should be used to emit several events.
   * "next" function return type is WorkEvent if you need to emit new event
   * or void if you don't need.
   * @param error never called normally
   * @param complete never called normally
   */
  subscribe(
    eventType: String|String[]|RegExp,
    next: (event: CardEvent, eventProcessor: EventProcessor) => CardEvent | void,
    error: (err: any) => void = () => {},
    complete: () => void  = () => {}
  ): void {
    this.sourceSream.buildEventProcessor(eventType, next, error, complete)
  }
}

/**
 * This class is used internally by EventProcessor and EventHubService,
 */
export class EventStream {
  private processors: Map<RegExp,Array<EventProcessor>> = new Map()

  emit(workEvent: CardEvent) {
    this.processors.forEach((processorList: EventProcessor[], key: RegExp) => {
      if (key.test(workEvent.type))
        processorList.forEach(processor => processor.next(workEvent))
    })
  }

  buildEventProcessor(
      eventType: String|String[]|RegExp,
      next: (value: CardEvent, eventProcessor: EventProcessor) => CardEvent | void,
      error: (err: any) => void = () => {},
      complete: () => void  = () => {}
  ): EventProcessor {
    const type = typeof eventType;
    if (eventType instanceof RegExp) {
      // event is of type regex
      const eventProcessor = new EventProcessor(next, error,
        complete, this);
      if (this.processors.get(eventType) == null) this.processors.set(eventType, new Array<EventProcessor>())
      this.processors.get(eventType)?.push(eventProcessor);
      return eventProcessor
    } else if (type == "string") {
      // event is of type string
      return this.buildEventProcessor(
        new RegExp("^"+eventType+"$"), next, error, complete)
    } else {
      // event is of type string []
      var regexString = "^("
      for(var i = 0; i < eventType.length; i ++) {
        if (i>0) regexString = regexString + "|"
        regexString = regexString + eventType[i]
      }
      return this.buildEventProcessor(
        new RegExp(regexString+")$"), next, error, complete)
    }
  }
}
