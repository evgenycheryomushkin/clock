import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { EventHubService } from 'src/app/event-hub.service';
import { WorkEvent } from 'src/app/data/work-event';

@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.scss']
})
export class ClockComponent {
  @ViewChild('backgroundCanvas', {static: false}) 
  protected backgroundCanvas: ElementRef;
  protected context: CanvasRenderingContext2D;
  protected backgroundImage: HTMLImageElement;
    
  constructor(
  ) {
  }


  async loadBackground(app:ClockComponent, imgSrs: string) {
    app.backgroundImage = await loadImage(imgSrs);

    app.backgroundCanvas.nativeElement.height = app.backgroundImage.height
    app.backgroundCanvas.nativeElement.width = app.backgroundImage.width

    app.context.canvas.height = app.backgroundImage.height
    app.context.canvas.width = app.backgroundImage.width

    app.context.drawImage(app.backgroundImage, 0,0)
  }
}

export async function loadImage(src: string): Promise<HTMLImageElement> {
  const image = new Image();
  image.src = src;
  return new Promise(resolve => {
      image.onload = (ev) => {
          resolve(image);
      }
  });
}
