import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClockComponent } from './clock/clock.component';
import { ArrowComponent } from './arrow/arrow.component';



@NgModule({
  declarations: [
    ClockComponent,
    ArrowComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ClockModule { }
