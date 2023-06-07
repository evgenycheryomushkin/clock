import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { EventHubService } from 'src/app/event-hub.service';
import { WorkEvent } from 'src/app/data/work-event';

@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.scss']
})
export class ClockComponent implements AfterViewInit {
  @ViewChild('backgroundCanvas', {static: false}) 
  private backgroundCanvas: ElementRef;
  private context: CanvasRenderingContext2D;
  private backgroundImage: HTMLImageElement;
    
  constructor(
    private eventHubService: EventHubService
  ) {
  }

  ngAfterViewInit(): void {
    this.context = this.backgroundCanvas.nativeElement.getContext('2d');
    this.loadBackground(this);
  }

  async loadBackground(app:ClockComponent) {
    app.backgroundImage = await loadImage('/assets/images/pensil/pensil_clock_background.png')

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
