import { Routes } from "@angular/router";
import { DetailComponent } from "../incomeExpense/detail/detail.component";
import { IncomeExpenseComponent } from "../incomeExpense/income-expense.component";
import { StatisticsComponent } from "../incomeExpense/statistics/statistics.component";


export const dashboardRoutes: Routes = [
  { path: '', component: StatisticsComponent },
  { path: 'income-expenses', component: IncomeExpenseComponent },
  { path: 'detail', component: DetailComponent },
]
