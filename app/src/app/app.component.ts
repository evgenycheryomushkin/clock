import { Component, ElementRef, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { filter, map } from 'rxjs';
import { CardService } from './card.service';
import { WorkEvent } from './data/work-event';
import { EventHubService } from './event-hub.service';
import { NavigationEnd, Router } from '@angular/router';
import { BackendService } from './backend.service';
import { Rectangle } from './data/rectangle';
import { CardComponent } from './card/card.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('appElement') appElement: ElementRef;

  constructor(
    private eventHubService: EventHubService,
    public cardService: CardService,
    private backendService: BackendService,
    private router: Router,
    private renderer: Renderer2
  ) {
    eventHubService.init();
    cardService.init();
    backendService.init();
  }

  ngOnInit(): void {
    const appComponent = this;
    this.buildNewIdProcessor(appComponent)
    this.buildSessionKeySource(appComponent)
  }

  buildNewIdProcessor(appComponent: AppComponent) {
    appComponent.eventHubService.buildProcessor(WorkEvent.NEW_WITH_ID,
      (event: WorkEvent) => {
        const id = +event.data.get(WorkEvent.ID)

        const r = new Rectangle(
          window.scrollX,
          window.scrollY,
          window.innerWidth,
          window.innerHeight
        )

        appComponent.eventHubService.emit(new WorkEvent(
          WorkEvent.NEW_WITH_BOUNDING_RECT,
          WorkEvent.ID, ""+id,
          WorkEvent.BOUNDING_RECT,
          JSON.stringify(r)
        ))
      })
  }

  buildSessionKeySource(appComponent: AppComponent) {
    const navigationEnd = this.router.events
      .pipe(
        filter(e => e instanceof NavigationEnd),
        map((e) => e as NavigationEnd),
        map((ne: NavigationEnd) => {
          return new WorkEvent(WorkEvent.KEY_EVENT, WorkEvent.KEY, ne.url.slice(1))
        }
        ))
    this.eventHubService.registerSource(navigationEnd)
  }
}
