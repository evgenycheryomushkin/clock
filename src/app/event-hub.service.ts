import { Injectable } from '@angular/core';
import { WorkEvent } from './card/event/work-event';
import { Observable, Observer } from 'rxjs';


export class EventStream extends Observable<WorkEvent> {
  observer: Observer<WorkEvent> | undefined
  constructor() {
    super((observer: Observer<WorkEvent>) => {
      this.observer = observer;
    })
  }

  emit(workEvent: WorkEvent) {
    this.observer?.next(workEvent);
  }
}

@Injectable({
  providedIn: 'root'
})
export class EventHubService {
  eventStream: EventStream | undefined;


  constructor() { 
    this.eventStream = new EventStream()
    this.eventStream.subscribe(next => {
      console.log(next)
    })
  }

  register(observable: Observable<WorkEvent>) {
    observable.subscribe(
      next => this.eventStream?.emit(next)
    )
  }
}
