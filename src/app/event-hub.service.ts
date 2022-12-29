import { Injectable } from '@angular/core';
import { WorkEvent } from './card/event/work-event';
import { Observable, Observer } from 'rxjs';
type Callback = (workEvent: WorkEvent) => void;

export abstract class EventSubscriber implements Observer<WorkEvent> {
  eventStream: EventStream | undefined

  next: (value: WorkEvent) => void = (value: WorkEvent) => {};
  
  emit(workEvent: WorkEvent) {
    this.eventStream?.emit(workEvent)
  }
  error: (err: any) => void = (err: any) => {}
  complete: () => void = () => {}

  register(eventStream: EventStream) {
    this.eventStream = eventStream
  }
}

export class EventStream {
  subscribers: Array<EventSubscriber> = new Array()
    
  emit(workEvent: WorkEvent) {
    this.subscribers.forEach(subscriber => subscriber.next(workEvent))
  }

  register(eventSubscriber:EventSubscriber) {
    eventSubscriber.register(this);
    this.subscribers.push(eventSubscriber);
  }

}

@Injectable({
  providedIn: 'root'
})
export class EventHubService {
  sourceSream: EventStream;

  init() {
    console.log("Event Hub Service initialized")
  }

  constructor() { 
    this.sourceSream = new EventStream()
  }

  consoleLogSubscriber = new class extends EventSubscriber {
    constructor() {
      super();
      this.next = (value: WorkEvent) => 
        console.log(value)
    }

  }


  registerSource(observable: Observable<WorkEvent>) {
    observable.subscribe(
      next => this.sourceSream?.emit(next)
    )
  }
}
