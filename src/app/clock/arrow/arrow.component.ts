import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { loadImage } from '../clock/clock.component';

@Component({
  selector: 'app-arrow',
  templateUrl: './arrow.component.html',
  styleUrls: ['./arrow.component.scss']
})
export class ArrowComponent implements AfterViewInit {

  @ViewChild('arrowCanvas', {static: false}) private arrowCanvas: ElementRef;
  @Input() x:number;
  @Input() y:number;
  @Input() d:number;
  @Input() imageName:string;
  @Input() multiplier: number;
  @Input() divider: number;
  private context: CanvasRenderingContext2D;
  private arrowImage: HTMLImageElement;
  private time: number;
  h: number;
  w: number;
  top: string;
  left: string;

  ngAfterViewInit(): void {
    this.context = this.arrowCanvas.nativeElement.getContext('2d');
    this.init(this)
  }

  async init(app:ArrowComponent) {
    app.arrowImage = await loadImage(app.imageName)

    app.h = app.arrowImage.height
    app.w = app.arrowImage.width

    app.context.canvas.height = 2 * app.h + 2 * app.d
    app.context.canvas.width = 2 * app.h + 2 * app.d
    
    app.left = ""+(app.x - app.h - app.d)+"px"
    app.top = ""+(app.y - app.h - app.d)+"px"
    app.arrowCanvas.nativeElement.height = 2 * app.h + 2 * app.d
    app.arrowCanvas.nativeElement.width = 2 * app.h + 2 * app.d

    app.timer(app)
  }

  async drawArrow(app:ArrowComponent, angle: number) {
        app.context.save()
        app.context.clearRect(0, 0, app.context.canvas.width, app.context.canvas.height)
        app.context.translate(app.h + app.d ,app.h + app.d)    
        app.context.rotate(Math.PI / 180 * angle)
        app.context.drawImage(app.arrowImage, -app.w / 2, 
          -app.h-app.d)
        app.context.restore()
  }

  async timer(app:ArrowComponent) {
    setInterval(() => {
      const now = Math.floor(Date.now() / 1000.0);
      if (app.time == null || app.time != now)
        app.drawArrow(app, Math.floor(now/this.divider)*this.multiplier % 360)
      app.time = now
    }, 50)
  }
}
