import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClockComponent } from './clock/clock.component';
import { ArrowComponent } from './arrow/arrow.component';
import { PensilComponent } from './pensil/pensil.component';
import { VrungelComponent } from './vrungel/vrungel.component';



@NgModule({
  declarations: [
    ClockComponent,
    ArrowComponent,
    PensilComponent,
    VrungelComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ClockModule { }
