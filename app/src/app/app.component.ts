import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { filter, map } from 'rxjs';
import { CardService } from './service/card.service';
import { CardEvent } from './data/card-event';
import { EventHubService } from './service/event-hub.service';
import { NavigationEnd, Router } from '@angular/router';
import { BackendService } from './service/backend.service';
import { AllowService } from './service/allow.service';
import { RoutingService } from './service/routing.service';
import { CardPlaceService } from './service/card-place.service';

/**
 * Application component. It contains clock and list of cards.
 * Each card is placed on its separate place. You first move card
 * by mouse to the place where you want to put it. Then
 * card is edited and placed.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('appElement') appElement: ElementRef;

  /**
   * Initialize services. Should be done once.
   */
  constructor(
    private eventHubService: EventHubService,
    public cardService: CardService,
    backendService: BackendService,
    routingService: RoutingService,
    allowService: AllowService,
    cardPlaceService: CardPlaceService,

    private router: Router,
    private renderer: Renderer2
  ) {
    eventHubService.init()
    cardService.init()
    backendService.init()
    routingService.init()
    allowService.init()
    cardPlaceService.init()
  }

  ngOnInit(): void {
    const appComponent = this
    this.buildSessionKeySource(appComponent)
  }

  buildSessionKeySource(appComponent: AppComponent) {
    const navigationEnd = this.router.events
      .pipe(
        filter(e => e instanceof NavigationEnd),
        map((e) => e as NavigationEnd),
        map((ne: NavigationEnd) => {
          return new CardEvent(CardEvent.APP_NAVIGATION_END_EVENT, 
            CardEvent.SESSION_KEY, ne.url.slice(1))
        }))
    this.eventHubService.registerSource(navigationEnd)
  }
}
