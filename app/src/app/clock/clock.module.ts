import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClockComponent } from './clock/clock.component';
import { ArrowComponent } from './arrow/arrow.component';
import { PensilComponent } from './pensil/pensil.component';
import { VrungelComponent } from './vrungel/vrungel.component';
import { ForegroundComponent } from './foreground/foreground.component';
import {ForestComponent} from "./forest/forest.component";



@NgModule({
  declarations: [
    ClockComponent,
    ArrowComponent,
    ForegroundComponent,
    PensilComponent,
    VrungelComponent,
    ForestComponent
  ],
  providers: [
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PensilComponent,
    VrungelComponent,
    ForestComponent
  ]
})
export class ClockModule { }
