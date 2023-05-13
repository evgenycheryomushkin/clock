import { Injectable } from '@angular/core';
import { WorkEvent } from './work-event';
import { Observable } from 'rxjs';
import { EventProcessor } from './event-processor';

export class EventStream {
  private processors: Map<RegExp,Array<EventProcessor>> = new Map()
    
  emit(workEvent: WorkEvent) {
    this.processors.forEach((processorList: EventProcessor[], key: RegExp) => {
      if (key.test(workEvent.type)) 
        processorList.forEach(processor => processor.next(workEvent))
    })
  }

  buildEventProcessor(
      eventType: string|RegExp,
      next: (value: WorkEvent, eventProcessor: EventProcessor) => void,
      error: (err: any) => void = () => {},
      complete: () => void  = () => {}
  ): EventProcessor {
    if (eventType instanceof RegExp) {
      const eventProcessor = new EventProcessor(next, error,
        complete, this);
      if (this.processors.get(eventType) == null) this.processors.set(eventType, new Array<EventProcessor>())
      this.processors.get(eventType)?.push(eventProcessor);
      return eventProcessor    
    } else
    return this.buildEventProcessor(
      new RegExp("^"+eventType+"$"), next, error, complete)
  }
}

@Injectable({
  providedIn: 'root'
})
export class EventHubService {
  public sourceSream: EventStream = new EventStream()

  init() {
    console.log("Event Hub Service initialized")
  }

  constructor() { 
    this.buildProcessor(RegExp("*"),
      (value: WorkEvent) => 
          console.log(value)
      )
    }

  registerSource(observable: Observable<WorkEvent>) {
    observable.subscribe(
      next => this.sourceSream.emit(next)
    )
  }

  emit(workEvent: WorkEvent) {
    this.sourceSream.emit(workEvent)
  }

  buildProcessor(
    eventType: string|RegExp,
    next: (event: WorkEvent, eventProcessor: EventProcessor) => void,
    error: (err: any) => void = () => {},
    complete: () => void  = () => {}
  ): EventProcessor {
    return this.sourceSream.buildEventProcessor(eventType, next, error, complete)
  }
}
