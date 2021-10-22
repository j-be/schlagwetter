import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Measurement } from './state/domain';
import { FetchMeasurements } from './state/measurements.state';

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
  public measurements$?: Observable<Measurement[]>;

  public humidity$: Observable<number> | undefined;
  public temperature$: Observable<number> | undefined;
  public chartData$: Observable<any> | undefined;

  public basicOptions: any;

  constructor(
    private store: Store,
  ) {
  }
​
  ngOnInit() {
    this.store.dispatch(new FetchMeasurements());

    this.temperature$ = this.measurements$?.pipe(
      map(measurements => measurements?.length ? measurements[0].temperature : -273.15)
    );
    this.humidity$ = this.measurements$?.pipe(
      map(measurements => measurements?.length ? measurements[0].humidity : -1)
    );
    this.chartData$ = this.measurements$?.pipe(
      map(measurements => ({
        labels: measurements.map(measurement => measurement.recorded_at),
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
          ticks: {
            color: '#ebedef'
          },
          grid: {
            color: 'rgba(255,255,255,0.2)'
          },
        },
        temp: {
          position: 'left',
          suggestedMin: 0,
          suggestedMax: 40,
          ticks: {
            color: '#ebedef'
          },
          grid: {
            color: 'rgba(255,255,255,0.2)'
          },
        },
        hum: {
          position: 'right',
          suggestedMin: 0,
          suggestedMax: 100,
          ticks: {
            color: '#ebedef'
          },
          grid: {
            color: 'rgba(255,255,255,0.2)'
          },
        }
      },
      plugins: {
        legend: {
            labels: {
                color: '#ebedef'
            }
        }
      },
      radius: 0,
    };
  }
}
