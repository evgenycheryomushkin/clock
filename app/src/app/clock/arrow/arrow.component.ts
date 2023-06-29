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
  @Input() arrowType: string;
  @Input() debug?: number;
  private context: CanvasRenderingContext2D;
  private arrowImage: HTMLImageElement;
  h: number;
  w: number;
  top: string;
  left: string;
  angle: number;

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

    if (app.debug != undefined) {
      app.drawArrow(app, app.debug)
    } else {
      app.timer(app)
    }
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
      const nowAngle = this.calcAngle(new Date())
      if (app.angle == null || app.angle != nowAngle)
        app.drawArrow(app, nowAngle)
      app.angle = nowAngle
    }, 50)
  }
  
  calcAngle(date: Date) {
    if (this.arrowType == "hour") {
      return Math.floor((date.getHours()%12)*30+date.getMinutes()/2);
    } else if (this.arrowType == "minute") {
      return date.getMinutes()*6;
    } else {
      return date.getSeconds()*6;
    }
  }
}
