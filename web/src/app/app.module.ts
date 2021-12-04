import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';

import { ChartModule } from 'primeng/chart'
import { DropdownModule } from 'primeng/dropdown';

import {environment} from '../environments/environment';

import { AppComponent } from './app.component';
import { MeasurementsState } from './state/measurements.state';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    // NGXS
    NgxsModule.forRoot([MeasurementsState], {
      developmentMode: !environment.production
    }),
    NgxsReduxDevtoolsPluginModule.forRoot({
      disabled: environment.production,
    }),
    // PrimeNG
    ChartModule,
    DropdownModule,
  ],

  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
