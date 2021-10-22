import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { State, Action, StateContext } from '@ngxs/store';
import { Measurement } from './domain';
​
export class FetchMeasurements {
  static readonly type = '[Measurements] Fetch';
}

export class MeasurementsReceived {
  static readonly type = '[Measurements] Received';
  constructor(public measurements: Measurement[]) {}
}​

export interface MeasurementsModel {
  measurements: Measurement[];
}
​
@State<MeasurementsModel>({
  name: 'measurements',
  defaults: {
    measurements: [],
  }
})
@Injectable()
export class MeasurementsState {

  constructor(
    private httpClient: HttpClient,
  ) {
  }

  @Action(FetchMeasurements)
  fetchMeasurements(ctx: StateContext<MeasurementsModel>) {
    this.httpClient.get<Measurement[]>("/api/recent")
        .subscribe(measurements => ctx.dispatch(new MeasurementsReceived(measurements)));
  }

  @Action(MeasurementsReceived)
  measurementsReceived(ctx: StateContext<MeasurementsModel>, action: MeasurementsReceived) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      measurements: action.measurements,
    });
  }
}
