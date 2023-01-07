export class IncomeExpense {

  constructor(
    public description?: string,
    public amount?: number | string,
    public type?: 'income' | 'expense',
    public uid?: string
  ) { }
}
