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

@NgModule({
  declarations: [
    AppComponent,
    CardComponent,
    ClockComponent,
    ArrowComponent,
    AddComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
