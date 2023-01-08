import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncomeExpenseComponent } from './income-expense.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { DetailComponent } from './detail/detail.component';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { OrderInExpsPipe } from '../pipes/order-in-exps.pipe';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    DashboardComponent,
    IncomeExpenseComponent,
    StatisticsComponent,
    DetailComponent,
    OrderInExpsPipe
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class IncomeExpenseModule { }
