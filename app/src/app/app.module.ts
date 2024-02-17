import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { InjectableRxStompConfig, RxStompService, rxStompServiceFactory } from '@stomp/ng2-stompjs';
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
import { myRxStompConfig } from './my-rx-stomp.config';
import { SettingsComponent } from './settings/settings.component';
import { SettingsDialogComponent } from './settings-dialog/settings-dialog.component';

@NgModule({
  declarations: [
    AddComponent,
    CardComponent,
    AppComponent,
    SettingsComponent,
    SettingsDialogComponent
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
    {
      provide: InjectableRxStompConfig,
      useValue: myRxStompConfig
    },
    {
      provide: RxStompService,
      useFactory: rxStompServiceFactory,
      deps: [InjectableRxStompConfig]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
