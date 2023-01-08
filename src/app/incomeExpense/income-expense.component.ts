import { Component, OnDestroy, OnInit } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { AuthError } from '@firebase/auth';
import Swal from 'sweetalert2';

// models
import { IncomeExpense } from '../models/incomeExpenses.model';
import { User } from '../models/user.model';

// services|actions
import { IncomeExpenseService } from '../services/incomeExpense.service';
import * as uiActions from '../shared/ui.actions'

// store
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from '../app.store';


type IncomeExpenseType = 'income' | 'expense'

@Component({
  selector: 'app-income-expense',
  templateUrl: './income-expense.component.html',
})
export class IncomeExpenseComponent implements OnInit, OnDestroy {

  incomeExpenseForm = this.fb.group({
    description: ['', [Validators.required, Validators.minLength(4)]],
    amount: ['', [Validators.required, Validators.min(1_000)]],
  })
  toggleIncomeExpense = true;
  isLoading = false;

  private user!: User | null;
  private storeSubscription!: Subscription;


  constructor(
    private fb: NonNullableFormBuilder,
    private store: Store<AppState>,
    private incoExService: IncomeExpenseService
  ) { }


  ngOnInit(): void {
    this.storeSubscription = this.store.subscribe(({ auth, ui }) => {
      this.user = auth.user;
      this.isLoading = ui.isLoading
    })
  }

  ngOnDestroy(): void {
    this.storeSubscription.unsubscribe();
  }

  onToogleIncomeExpense(): void {
    this.toggleIncomeExpense = !this.toggleIncomeExpense
  }

  private hasIncomeOrExpense(): IncomeExpenseType {
    return this.toggleIncomeExpense ? 'income' : 'expense'
  }


  async onSave(): Promise<void> {
    if (this.incomeExpenseForm.invalid) {
      return
    }
    else {
      this.store.dispatch(uiActions.startLoading())

      const { amount, description } = this.incomeExpenseForm.value
      const newItem = new IncomeExpense(
        description, amount, this.hasIncomeOrExpense(), this.user?.id
      );

      try {
        await this.incoExService.addIncomeExpense(newItem);

        Swal.fire({
          icon: 'success',
          title: 'Saved',
          text: `${newItem.type} successfully added`,
          timer: 2_400
        })
        this.incomeExpenseForm.reset();
      }
      catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Oops',
          text: (err as AuthError).message,
        })
      }
      finally {
        this.store.dispatch(uiActions.stopLoading());
      }
    }
  }
}
