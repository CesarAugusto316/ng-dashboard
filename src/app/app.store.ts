import { ActionReducerMap } from '@ngrx/store';
import * as ui from './shared/ui.reducer';
import * as auth from './auth/auth.reducer';
import * as inExs from './incomeExpense/income-expense.reducer';


export interface AppState {
  ui: ui.State,
  auth: auth.State,
  incomExpenses: inExs.State
};

export const appReducers: ActionReducerMap<AppState> = {
  ui: ui.uiReducer,
  auth: auth.authReducer,
  incomExpenses: inExs.itemsReducer,
};
