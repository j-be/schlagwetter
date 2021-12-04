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

export class SetFetchMinutes {
  static readonly type = '[Measurements] Set fetch minutes';
  constructor(public fetchMinutes: number) {}
}

export interface MeasurementsModel {
  measurements: Measurement[];
  fetchMinutes: number;
}
​
@State<MeasurementsModel>({
  name: 'measurements',
  defaults: {
    measurements: [],
    fetchMinutes: 3 * 60,
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
    this.httpClient.get<Measurement[]>(`/schlagwetter/api/recent/${ctx.getState().fetchMinutes}`)
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

  @Action(SetFetchMinutes)
  setFetchMinutes(ctx: StateContext<MeasurementsModel>, action: SetFetchMinutes) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      fetchMinutes: action.fetchMinutes,
    });
    ctx.dispatch(new FetchMeasurements());
  }
}
