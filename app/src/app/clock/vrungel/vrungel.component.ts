import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ClockComponent } from '../clock/clock.component';

/**
 * Nice drawn clock. Credits
 * https://www.sberbank.com/promo/kandinsky/
 */
@Component({
  selector: 'app-vrungel',
  templateUrl: './vrungel.component.html',
  styleUrls: ['../clock/clock.component.scss']
})
export class VrungelComponent extends ClockComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    this.context = this.backgroundCanvas.nativeElement.getContext('2d')
    this.loadBackground(this, '/assets/images/vrungel/vrungel_background.png')
  }

  constructor() {
    super()
  }

}
