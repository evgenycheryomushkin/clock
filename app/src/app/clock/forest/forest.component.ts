import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ClockComponent, loadImage } from '../clock/clock.component';

/**
 * Pensil drawn clock. Credits
 * https://www.sberbank.com/promo/kandinsky/
 */
@Component({
  selector: 'app-forest',
  templateUrl: './forest.component.html',
  styleUrls: ['../clock/clock.component.scss']
})
export class ForestComponent extends ClockComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    this.context = this.backgroundCanvas.nativeElement.getContext('2d')
    this.loadBackground(this, '/assets/images/forest/background.png')
  }

  constructor() {
    super()
  }

}
