import { Injectable } from '@angular/core';
import { WorkEvent } from './card/event/work-event';
import { Observable, Observer } from 'rxjs';
type Callback = (workEvent: WorkEvent) => void;

export class EventSubscriber implements Observer<WorkEvent> {

  constructor(
    private nextValue: (value: WorkEvent, 
      eventSubscriber: EventSubscriber) => void,
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

export class EventStream {
  subscribers: Array<EventSubscriber> = new Array()
    
  emit(workEvent: WorkEvent) {
    this.subscribers.forEach(subscriber => subscriber.next(workEvent))
  }

  buildEventSubscriber(
      next: (value: WorkEvent, eventSubscriber: EventSubscriber) => void,
      error: (err: any) => void = (err: any) => {},
      complete: () => void  = () => {}
  ): EventSubscriber {
    const eventSubscriber = new EventSubscriber(next, error,
      complete, this);
    this.subscribers.push(eventSubscriber);
    return eventSubscriber
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
    this.sourceSream.buildEventSubscriber(
      (value: WorkEvent, eventSubscriber: EventSubscriber) => 
          console.log(value)
      )
    }

  registerSource(observable: Observable<WorkEvent>) {
    observable.subscribe(
      next => this.sourceSream.emit(next)
    )
  }

  buildEventSubscriber(
    next: (value: WorkEvent, eventSubscriber: EventSubscriber) => void,
    error: (err: any) => void = (err: any) => {},
    complete: () => void  = () => {}
  ): EventSubscriber {
    return this.sourceSream.buildEventSubscriber(next, error, complete)
  }
}
