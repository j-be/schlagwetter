import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxsModule } from '@ngxs/store';

import { ChartModule } from 'primeng/chart'

import {environment} from '../environments/environment';

import { AppComponent } from './app.component';
import { MeasurementsState } from './state/measurements.state';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    // NGXS
    NgxsModule.forRoot([MeasurementsState], {
      developmentMode: !environment.production
    }),
    // PrimeNG
    ChartModule,
  ],

  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
