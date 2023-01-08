import { Pipe, PipeTransform } from '@angular/core';
import { IncomeExpense } from '../models/incomeExpenses.model';


@Pipe({
  name: 'orderInExps'
})
export class OrderInExpsPipe implements PipeTransform {

  transform(items: IncomeExpense[]): IncomeExpense[] {
    return [...items].sort((a, b) => a?.type === 'income' ? -1 : 1);
  }
}
