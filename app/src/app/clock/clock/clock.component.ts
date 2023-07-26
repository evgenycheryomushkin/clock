import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { EventHubService } from 'src/app/service/event-hub.service';
import { WorkEvent } from 'src/app/data/work-event';

/**
 * Clock component
 */
@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.scss']
})
export class ClockComponent {
  /**
   * Background canvas
   */
  @ViewChild('backgroundCanvas', {static: false}) 
  protected backgroundCanvas: ElementRef;
  /**
   * canvas rendering context
   */
  protected context: CanvasRenderingContext2D;
  /**
   * background image
   */
  protected backgroundImage: HTMLImageElement;
    
  /**
   * Load background image
   * @param app ClickComponent
   * @param imgSrs source of image
   */
  async loadBackground(app:ClockComponent, imgSrs: string) {
    app.backgroundImage = await loadImage(imgSrs);

    app.backgroundCanvas.nativeElement.height = app.backgroundImage.height
    app.backgroundCanvas.nativeElement.width = app.backgroundImage.width

    app.context.canvas.height = app.backgroundImage.height
    app.context.canvas.width = app.backgroundImage.width

    app.context.drawImage(app.backgroundImage, 0,0)
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
