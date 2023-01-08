import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, Subscription } from 'rxjs';
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
      .pipe(filter(user => user !== null))
      .subscribe(({ user }) => {

        this.itemsSubscription = this.inExService.initObserver(user?.id as string)
          .subscribe(items => {
            this.store.dispatch(inExsActions.setItems({ items }))
          })
      })
  }


  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
    this.itemsSubscription.unsubscribe();
    this.store.dispatch(inExsActions.unSetItems())
  }
}
