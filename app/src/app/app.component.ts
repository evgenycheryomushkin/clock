import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { filter, fromEvent, map, tap } from 'rxjs';
import { CardService } from './card.service';
import { WorkEvent } from './work-event';
import { EventHubService } from './event-hub.service';
import { Card } from './card';
import { NavigationEnd, Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('appElement') appElement: ElementRef;

  cards = new Array<Card>()

  y = 20

  constructor(
    private eventHubService: EventHubService,
    private cardService: CardService,
    private router: Router
  ) {
    eventHubService.init();
    cardService.init();
  }

  getNewY() {
    return this.y += 20
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
        const x = window.scrollX
        const y = window.scrollY
        const w = window.innerWidth
        const h = window.innerHeight
        console.log(x, y, w, h)
        appComponent.cards.push(new Card(
          id, "", "", (new Date()).toString(), { x: Math.min(600, x + w - 200), y: appComponent.getNewY() + y }
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
