import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { loadImage } from '../clock/clock.component';

/**
 * Component responsible for drawing arrow. Click has 2-3 arrows.
 * Each arrow has center position. It is middle bottom point of image.
 * Arrow is directed upwards. There is also offset parameter d
 * that can be positive or negative. D is vertical offset from center to
 * middle-bottom position.
 */
@Component({
  selector: 'app-arrow',
  templateUrl: './arrow.component.html',
  styleUrls: ['./arrow.component.scss']
})
export class ArrowComponent implements AfterViewInit {

  /**
   * Arrow canvas
   */
  @ViewChild('arrowCanvas', {static: false}) 
  private arrowCanvas: ElementRef;
  /**
   * X coordinate of arrow center. For center description
   * see class description.
   */
  @Input() x:number;
  /**
   * Y coordinate of arrow center. For center description
   * see class description.
   */
  @Input() y:number;
  /**
   * Distance from center to bottom-middle position of arrow. For center description
   * see class description.
   */
  @Input() d:number;
  /**
   * Name of image. Path to image file relative
   * to asdets folder.
   */
  @Input() imageName:string;
  /**
   * Type of arrow. Can be 'hour', 'minute' or 'second'
   */
  @Input() arrowType: string;
  /**
   * Debug mode. If it is set then it is angle of arrow.
   * Arrow is drawn at this given angle and do not move.
   */
  @Input() debug?: number;
  /**
   * Canvas rendering context.
   */
  private context: CanvasRenderingContext2D;
  /**
   * Arrow image as html element
   */
  private arrowImage: HTMLImageElement;
  /**
   * X position of arrow center. See description of class for details about center.
   */
  h: number;
  /**
   * Y position of arrow center. See description of class for details about center.
   */
  w: number;
  /**
   * Top position of canvas. See html for details
   */
  top: string;
  /**
   * Left position of canvas. See html for details
   */
  left: string;
  /**
   * Previous value of arrow angle. Null in the beginning.
   * If angle changes than arrow is redrawn. Arrow is redrawn
   * on every tick. Timer tics every 50 milliseconds.
   */
  angle: number;

  /**
   * Initialize arrow
   */
  ngAfterViewInit(): void {
    this.context = this.arrowCanvas.nativeElement.getContext('2d');
    this.init(this)
  }

  /**
   * If debug is on then we draw arrow only once. If debug is off
   * then we draw arrow every interval. Every 50 ms we check, if arrow angle
   * changes then we redraw arrow with new angle.
   * @param app ArrowComponent (this)
   */
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

  /**
   * Draw arrow at given angle.
   * @param app ArrowComponent
   * @param angle angle (0-360)
   */
  async drawArrow(app:ArrowComponent, angle: number) {
        app.context.save()
        app.context.clearRect(0, 0, app.context.canvas.width, app.context.canvas.height)
        app.context.translate(app.h + app.d ,app.h + app.d)    
        app.context.rotate(Math.PI / 180 * angle)
        app.context.drawImage(app.arrowImage, -app.w / 2, 
          -app.h-app.d)
        app.context.restore()
  }

  /**
   * Start timer to draw arrow. Timer ticks every 50ms
   * but arrow do not redraw every time. It redraw only
   * when angle changes
   * @param app ArrowComponent
   */
  async timer(app:ArrowComponent) {
    setInterval(() => {
      const nowAngle = this.calcAngle(new Date())
      if (app.angle == null || app.angle != nowAngle)
        app.drawArrow(app, nowAngle)
      app.angle = nowAngle
    }, 50)
  }
  
  /**
   * Calc angle depending on arrow type
   * @param date current time
   * @returns angle (0-360)
   */
  calcAngle(date: Date) {
    if (this.arrowType == "hour") {
      return (Math.floor((date.getHours()%12)*30+date.getMinutes()/2))%360;
    } else if (this.arrowType == "minute") {
      return (date.getMinutes()*6)%360;
    } else {
      return (date.getSeconds()*6)%360;
    }
  }
}
