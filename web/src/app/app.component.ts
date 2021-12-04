import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Measurement } from './state/domain';
import { FetchMeasurements, SetFetchMinutes } from './state/measurements.state';

import { map } from 'rxjs/operators';
import 'chartjs-adapter-date-fns';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  title = 'schlagwetter-web';

  @Select((state: any) => state.measurements.measurements)
  public measurements$!: Observable<Measurement[]>;

  @Select((state: any) => state.measurements.fetchMinutes)
  public fetchMinutes$!: Observable<number>;

  public humidity$!: Observable<number>;
  public temperature$!: Observable<number>;
  public latestMeasurement$!: Observable<string>;
  public chartData$!: Observable<any>;

  public basicOptions: any;

  public timeSpans: {label: string, minutes: number}[];
  public selectedTimeSpan: number;

  constructor(
    private store: Store,
  ) {
    this.selectedTimeSpan = 3 * 60;

    this.timeSpans = [
        {label: '3 hours', minutes: 3 * 60},
        {label: '12 hours', minutes: 12 * 60},
        {label: '24 hours', minutes: 24 * 60},
    ];
  }

  refresh() {
    this.store.dispatch(new FetchMeasurements());
  }​

  selectedTimeSpanChanged($event: any): void {
    this.store.dispatch(new SetFetchMinutes($event?.value || 3 * 60));
  }

  ngOnInit() {
    this.refresh();

    this.temperature$ = this.measurements$.pipe(
      map(measurements => measurements?.length ? measurements[0].temperature : -273.15)
    );
    this.humidity$ = this.measurements$.pipe(
      map(measurements => measurements?.length ? measurements[0].humidity : -1)
    );
    this.latestMeasurement$ = this.measurements$.pipe(
      map(measurements => measurements?.length ? new Date(measurements[0].recorded_at + 'Z').toLocaleTimeString('DE') : '')
    );
    this.chartData$ = this.measurements$.pipe(
      map(measurements => ({
        labels: measurements.map(measurement => new Date(measurement.recorded_at + 'Z')),
        datasets: [
          {
            label: 'Temperature',
            data: measurements.map(measurement => measurement.temperature),
            borderColor: '#FFA726',
            yAxisID: 'temp',
          },
          {
            label: 'Humidity',
            data: measurements.map(measurement => measurement.humidity),
            borderColor: '#42A5F5',
            yAxisID: 'hum',
          }
        ],
      }))
    );

    this.basicOptions = {
      scales: {
        x: {
          type: 'time',
          time: {
            minUnit: 'hour',
            displayFormats: {
              hour: 'HH:00',
            },
          },
          ticks: {
            color: '#ebedef',
          },
          grid: {
            color: 'rgba(255,255,255,0.2)',
          },
        },
        temp: {
          position: 'left',
          suggestedMin: 0,
          suggestedMax: 40,
          ticks: {
            stepSize: 10,
            color: '#FFA726',
          },
          grid: {
            color: 'rgba(255,255,255,0.2)',
            tickColor: '#FFA726',
            borderColor: '#FFA726',
          },
        },
        hum: {
          position: 'right',
          suggestedMin: 0,
          suggestedMax: 100,
          ticks: {
            stepSize: 25,
            color: '#42A5F5',
          },
          grid: {
            color: 'rgba(255,255,255,0.2)',
            tickColor: '#42A5F5',
            borderColor: '#42A5F5',
          },
        },
      },
      plugins: {
        legend: {
            labels: {
                color: '#ebedef',
            },
        },
      },
      radius: 0,
    };
  }
}
