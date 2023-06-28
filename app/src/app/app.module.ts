import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { FormsModule } from '@angular/forms';
import { CardComponent } from './card/card.component';
import { ClockComponent } from './clock/clock/clock.component';
import { ArrowComponent } from './clock/arrow/arrow.component';
import { AddComponent } from './add/add.component';
import { RouterModule } from '@angular/router';
import { routes } from 'src/app/routes';
import { VrungelComponent } from './clock/vrungel/vrungel.component';
import { PensilComponent } from './clock/pensil/pensil.component';
import { ClockModule } from './clock/clock.module';

@NgModule({
  declarations: [
    AddComponent,
    CardComponent,
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ClockModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
