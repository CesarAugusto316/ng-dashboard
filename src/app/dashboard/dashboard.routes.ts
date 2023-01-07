import { Routes } from "@angular/router";
import { DetailComponent } from "../IncomeExpense/detail/detail.component";
import { IncomeExpenseComponent } from "../IncomeExpense/income-expense.component";
import { StatisticsComponent } from "../IncomeExpense/statistics/statistics.component";


export const dashboardRoutes: Routes = [
  { path: '', component: StatisticsComponent },
  { path: 'income-expenses', component: IncomeExpenseComponent },
  { path: 'detail', component: DetailComponent },
]
