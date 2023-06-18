import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ClockComponent, loadImage } from '../clock/clock.component';

@Component({
  selector: 'app-pensil',
  templateUrl: './pensil.component.html',
  styleUrls: ['../clock/clock.component.scss']
})
export class PensilComponent extends ClockComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    this.context = this.backgroundCanvas.nativeElement.getContext('2d')
    this.loadBackground(this, '/assets/images/pensil/pensil_clock_background.png')
  }

  constructor() {
    super()
  }

}
