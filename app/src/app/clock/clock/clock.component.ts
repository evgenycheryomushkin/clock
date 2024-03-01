import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { EventHubService } from 'src/app/service/event-hub.service';
import { CardEvent } from 'src/app/data/card-event';
import { HttpClient } from '@angular/common/http';
import {Arrow, ClockData} from "./data/ClockData";
import {map} from "rxjs";
import {TSMap} from "typescript-map";


/**
 * Clock component
 */
@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.scss']
})
export class ClockComponent implements AfterViewInit {
  /**
   * Background canvas
   */
  @ViewChild('backgroundCanvas', {static: false})
  protected backgroundCanvas: ElementRef

  currentClock: ClockData
  /**
   * canvas rendering context
   */
  protected context: CanvasRenderingContext2D
  /**
   * background image
   */
  protected backgroundImage: HTMLImageElement

  constructor(private eventHub: EventHubService,
              private  http: HttpClient) {
    eventHub.subscribe(CardEvent.RESIZE_EVENT, e => {
      this.loadBackgroundAdaptive(Number(e.data.get(CardEvent.WIDTH)), Number(e.data.get(CardEvent.HEIGHT)))
    })
    this.http.get("/assets/nature.json")
      .pipe(map(o => o as ClockData))
      .subscribe(
        clock => {
          this.currentClock = clock
          this.loadBackground(this,
            this.currentClock.images[this.currentClock.images.length-1].background).then(r => {
            console.log("background load complete")
          })
        }
      )
  }
  ngAfterViewInit(): void {
    this.context = this.backgroundCanvas.nativeElement.getContext('2d')
  }

  private async loadBackgroundAdaptive(width: number, height: number) {
    const i:number = this.chooseSize(this.currentClock, width, height)
    this.loadBackground(this, this.currentClock.images[i].background)
    this.arrows = this.currentClock.images[i].arrows
  }

  backgroundImageCache = new TSMap<string, HTMLImageElement>()
  loadBackgroundLock = false
  arrows: Arrow[]

  /**
   * Load background image
   * @param app ClickComponent
   * @param imgSrs source of image
   */
  async loadBackground(app:ClockComponent, imgSrs: string) {
    if (this.loadBackgroundLock) return
    this.loadBackgroundLock = true
    console.log("load background adaptive")
    await new Promise(f => setTimeout(f, 1000));
    if (this.backgroundImageCache.has(imgSrs)) {
      app.backgroundImage = this.backgroundImageCache.get(imgSrs)
    } else {
      app.backgroundImage = await loadImage(imgSrs)
      this.backgroundImageCache.set(imgSrs, this.backgroundImage)
    }
    await this.drawBackground(app);
    this.loadBackgroundLock = false
  }

  async drawBackground(app: ClockComponent) {
    app.backgroundCanvas.nativeElement.height = app.backgroundImage.height
    app.backgroundCanvas.nativeElement.width = app.backgroundImage.width

    app.context.canvas.height = app.backgroundImage.height
    app.context.canvas.width = app.backgroundImage.width

    app.context.drawImage(app.backgroundImage, 0, 0)
  }

  private chooseSize(currentClock: ClockData, width: number, height: number): number {
    let i;
    for(i = 0; i < currentClock.images.length-1; i ++) {
      if ( currentClock.images[i].width >= width && currentClock.images[i].height >= height) break;
    }
    console.log("choose size", i, width, height)
    return i
  }
}

/**
 * Load image
 * @param src source of image
 * @returns promise, as this function is async
 */
export async function loadImage(src: string): Promise<HTMLImageElement> {
  const image = new Image();
  image.src = src;
  return new Promise(resolve => {
    image.onload = (ev) => {
      resolve(image);
    }
  });
}
