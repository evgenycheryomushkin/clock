import { Component, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';

@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.scss']
})
export class ClockComponent implements AfterViewInit {
  // its important myCanvas matches the variable name in the template
  @ViewChild('minuteArrowCanvas', {static: false}) minuteArrowCanvas: ElementRef;
  // @ViewChild('hourArrowCanvas', {static: false}) hourArrowCanvas: ElementRef;
  @ViewChild('parentDiv', {static: false}) parentDiv: ElementRef;
  @Input("background")
  background = ""
  
  minuteContext: CanvasRenderingContext2D;
  // hourContext: CanvasRenderingContext2D;
  image: HTMLImageElement;
  minuteArrow: HTMLImageElement;
  minuteArrowImage: HTMLImageElement;

  ngAfterViewInit(): void {
    this.minuteContext = this.minuteArrowCanvas.nativeElement.getContext('2d');
    // this.hourContext = this.hourArrowCanvas.nativeElement.getContext('2d');

    // 580 960

    this.loadImages(this);
  }

  async loadImages(app:ClockComponent) {
    const backgroundImage = await loadImage('/assets/images/pensil/pensil_clock_background.png')
    app.background = backgroundImage.src
    app.minuteArrowImage = await loadImage('/assets/images/pensil/pensil_arrow_1.png')
    app.minuteArrow = app.minuteArrowImage
    
    app.minuteArrowCanvas.nativeElement.height = backgroundImage.height
    app.minuteArrowCanvas.nativeElement.width = backgroundImage.width

    app.minuteContext.canvas.height = backgroundImage.height
    app.minuteContext.canvas.width = backgroundImage.width

    app.secondTimer(app)
  }

  async secondTimer(app:ClockComponent) {
    setInterval(() => {
      var pos = {x: 578, y: 958}
      const now = new Date();
      app.minuteContext.save()
      app.minuteContext.clearRect(0,0,app.minuteContext.canvas.width, app.minuteContext.canvas.height)
      app.minuteContext.translate(pos.x ,pos.y)    
      app.minuteContext.rotate(Math.PI / 180 * now.getSeconds() * 6)
      app.minuteContext.drawImage(app.minuteArrowImage, -app.minuteArrowImage.width / 2, -app.minuteArrowImage.height-6, 
          app.minuteArrowImage.width, app.minuteArrowImage.height)
      app.minuteContext.restore()
    }, 500)
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
