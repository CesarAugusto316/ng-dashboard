import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, Subscription, take } from 'rxjs';
import { AppState } from '../app.store';
import { IncomeExpenseService } from '../services/incomeExpense.service';
import * as inExsActions from '../incomeExpense/income-expense.actions'


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {

  private userSubscription!: Subscription;
  private itemsSubscription!: Subscription

  constructor(
    private store: Store<AppState>,
    private inExService: IncomeExpenseService
  ) { }

  ngOnInit(): void {
    this.userSubscription = this.store.select('auth')
      .subscribe(({ user }) => {
        if (user) {
          this.itemsSubscription = this.inExService.initObserver(user?.id as string)
        }
      })
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
    this.itemsSubscription.unsubscribe();
    this.store.dispatch(inExsActions.unSetItems())
  }
}
