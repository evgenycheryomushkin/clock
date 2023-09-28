import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { StompConfig, StompService } from '@stomp/ng2-stompjs';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { FormsModule } from '@angular/forms';
import { CardComponent } from './card/card.component';
import { AddComponent } from './add/add.component';
import { RouterModule } from '@angular/router';
import { routes } from 'src/app/routes';
import { ClockModule } from './clock/clock.module';
import { HttpClientModule } from '@angular/common/http';

const stompConfig: StompConfig = {
  url: 'ws://127.0.0.1:15674/ws',

  headers: {
    login: 'guest',
    passcode: 'guest'
  },
  heartbeat_in: 0, 
  heartbeat_out: 20000, 
  reconnect_delay: 5000,
  debug: true
};

@NgModule({
  declarations: [
    AddComponent,
    CardComponent,
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ClockModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    StompService,
    {
      provide: StompConfig,
      useValue: stompConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
