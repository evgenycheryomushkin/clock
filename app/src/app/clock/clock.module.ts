import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClockComponent } from './clock/clock.component';
import { ArrowComponent } from './arrow/arrow.component';
import { ForegroundComponent } from './foreground/foreground.component';



@NgModule({
  declarations: [
    ClockComponent,
    ArrowComponent,
    ForegroundComponent,
  ],
  providers: [
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ClockComponent
  ]
})
export class ClockModule { }
