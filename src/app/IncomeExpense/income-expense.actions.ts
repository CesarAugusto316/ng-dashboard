import { createAction, props } from '@ngrx/store';
import { IncomeExpense } from '../models/incomeExpenses.model';


export const setItems = createAction(
  '[IncomeExpenses] setItems', props<{ item: IncomeExpense }>()
);
export const unSetItems = createAction('[IncomeExpenses] unSetItems',);
