import { createReducer, on } from '@ngrx/store';
import { startLoading, stopLoading } from './ui.actions';


export interface State {
  isLoading: boolean;
}

export const initialState: State = {
  isLoading: false,
}

export const uiReducer = createReducer(
  initialState,
  on(startLoading, (state) => ({ ...state, isLoading: true })),
  on(stopLoading, (state) => ({ ...state, isLoading: false })),
);
