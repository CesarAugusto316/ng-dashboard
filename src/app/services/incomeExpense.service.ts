import { Injectable, OnDestroy } from '@angular/core';
import { IncomeExpense } from '../models/incomeExpenses.model';

// fireStore
import { AngularFirestore } from '@angular/fire/compat/firestore';

// ngrxStore
import { Store } from '@ngrx/store';
import { AppState } from '../app.store';
import * as inExsActions from '../incomeExpense/income-expense.actions'
// import { AuthService } from './auth.service';
import { filter, pipe, Subscription, take } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class IncomeExpenseService {

  constructor(
    private firestore: AngularFirestore,
    private store: Store<AppState>,
    // private authService: AuthService
  ) { }

  async createIncomeExpense(incomeExpense: IncomeExpense) {
    return this.firestore
      .doc(`${incomeExpense.uid}/income-expense`)
      .collection('items')
      .add({ ...incomeExpense })
  }

  initObserver(uid: string): Subscription {
    return this.firestore
      .collection<IncomeExpense>(`${uid}/income-expense/items`)
      .valueChanges()
      .subscribe(items => {
        this.store.dispatch(inExsActions.setItems({ items }))
      })
  }
}
