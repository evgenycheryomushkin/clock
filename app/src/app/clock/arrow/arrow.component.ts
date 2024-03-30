import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { loadImage } from '../clock/clock.component';

@Component({
  selector: 'app-arrow',
  templateUrl: './arrow.component.html',
  styleUrls: ['./arrow.component.scss']
})
export class ArrowComponent implements AfterViewInit {
  @ViewChild('arrowCanvas', {static: false})
  private arrowCanvas: ElementRef;
  @Input() x:number;
  @Input() y:number;
  @Input() d:number;
  @Input() imageName:string;
  @Input() arrowType: string;
  @Input() smooth: boolean;
  @Input() linear: boolean;
  @Input() debug?: number;
  private context: CanvasRenderingContext2D;
  private arrowImage: HTMLImageElement;
  h: number;
  w: number;
  top: string;
  left: string;
  angle: number;

  constructor() {
  }

  /**
   * Initialize arrow
   */
  ngAfterViewInit(): void {
    this.context = this.arrowCanvas.nativeElement.getContext('2d');
    this.init(this)
  }

  async init(arrow:ArrowComponent) {
    arrow.arrowImage = await loadImage(arrow.imageName)

    arrow.h = arrow.arrowImage.height
    arrow.w = arrow.arrowImage.width

    arrow.context.canvas.height = 2 * arrow.h + 2 * arrow.d
    arrow.context.canvas.width  = 2 * arrow.h + 2 * arrow.d

    arrow.left = ""+(arrow.x - arrow.h - arrow.d)+"px"
    arrow.top =  ""+(arrow.y - arrow.h - arrow.d)+"px"
    arrow.arrowCanvas.nativeElement.height = 2 * arrow.h + 2 * arrow.d
    arrow.arrowCanvas.nativeElement.width = 2 * arrow.h + 2 * arrow.d

    if (arrow.debug != undefined) {
      arrow.drawArrow(arrow, arrow.debug)
    } else {
      arrow.timer(arrow)
    }
  }

  drawing = false
  async drawArrow(app:ArrowComponent, angle: number) {
    // TODO speed up by using rotate multiple times. perhaps drawimage once and then
    // rotate can be repeated
    if (!this.drawing) {
      this.drawing = true
      app.context.save()
      app.context.clearRect(0, 0, app.context.canvas.width, app.context.canvas.height)
      app.context.translate(app.h + app.d, app.h + app.d)
      app.context.rotate(Math.PI / 180 * angle)
      app.context.drawImage(app.arrowImage, -app.w / 2,
        -app.h - app.d)
      app.context.restore()
      this.drawing = false
    }
  }

  async timer(arrowComponent:ArrowComponent) {
    setInterval(() => {
      const nowAngle = this.calcAngle(new Date())
      if (arrowComponent.angle == null || arrowComponent.angle != nowAngle)
        arrowComponent.drawArrow(arrowComponent, nowAngle)
      arrowComponent.angle = nowAngle
    }, 50)
  }

  calcAngle(date: Date) {
    if (this.arrowType == "hour") {
      return this.calculateHourAngle(date);
    } else if (this.arrowType == "minute") {
      return this.calculateMinuteAngle(date);
    } else {
      return this.calculateSecondAngle(date);
    }
  }

  private interpolateSecond(date: Date, range: number) {
    return this.interpolate11(date.getMilliseconds()/1000.0) * range;
  }
  private interpolate11(x: number): number {
    if (x==0) return 0.0
    const k = 12
    return 1.0 / (1.0 + Math.exp(-k*x))
  }


  private calculateSecondAngle(date: Date) {
    let adder = 0
    if (!this.linear) adder = this.interpolateSecond(date, 6)
    return date.getSeconds() * 6 % 360 + adder
  }

  private calculateMinuteAngle(date: Date) {
    let adder = 0
    const seconds = date.getSeconds()
    if (!this.linear && seconds == 59) {
      adder = this.interpolateSecond(date, 6)
    }
    return date.getMinutes() * 6 % 360 + adder
  }

  private calculateHourAngle(date: Date) {
    if (!this.linear) {
      let adder = 0
      if (date.getMinutes() == 59 && date.getSeconds() == 59)
        adder = this.interpolateSecond(date, 30)
      return ((date.getHours() % 12) * 30 + adder) % 360;
    } else
      return ((date.getHours() % 12) * 30 + date.getMinutes() / 2) % 360;
  }
}
