import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { loadImage } from '../clock/clock.component';

/**
 * Foreground element of clock. Some elements are in foreground. So
 * arrows are behind them. @see ArrowComponent
 */
@Component({
  selector: 'app-foreground',
  templateUrl: './foreground.component.html',
  styleUrls: ['./foreground.component.scss']
})
export class ForegroundComponent implements AfterViewInit {

  @ViewChild('foregroundCanvas', {static: false}) 
  private foregroundCanvas: ElementRef;
  @Input() x:number;
  @Input() y:number;
  @Input() imageName:string;
  private context: CanvasRenderingContext2D;
  private foregroundImage: HTMLImageElement;
  h: number;
  w: number;
  top: string;
  left: string;
  angle: number;

  ngAfterViewInit(): void {
    this.context = this.foregroundCanvas.nativeElement.getContext('2d');
    this.init(this)
  }

  async init(app:ForegroundComponent) {
    app.foregroundImage = await loadImage(app.imageName)

    app.h = app.foregroundImage.height
    app.w = app.foregroundImage.width

    app.context.canvas.height = 2 * app.h
    app.context.canvas.width = 2 * app.h
    
    app.left = ""+(app.x - app.h)+"px"
    app.top = ""+(app.y - app.h)+"px"
    app.foregroundCanvas.nativeElement.height = 2 * app.h 
    app.foregroundCanvas.nativeElement.width = 2 * app.h 
    app.drawForeground(app)
  }

  async drawForeground(app:ForegroundComponent) {
        app.context.save()
        app.context.clearRect(0, 0, app.context.canvas.width, app.context.canvas.height)
        app.context.translate(app.h ,app.h)    
        app.context.drawImage(app.foregroundImage, -app.w / 2, 
          -app.h)
        app.context.restore()
  }
}
