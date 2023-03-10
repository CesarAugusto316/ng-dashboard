import { createReducer, on } from '@ngrx/store';
import { IncomeExpense } from '../models/incomeExpenses.model';
import { setItems, unSetItems } from './income-expense.actions';


export interface State {
  items: IncomeExpense[];
};

export const initialState: State = {
  items: [],
};

export const itemsReducer = createReducer(
  initialState,
  on(setItems, (state, { type, items: items }) => ({ items })),
  on(unSetItems, (state) => initialState),
);
