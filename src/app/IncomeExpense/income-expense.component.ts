import { Component, OnDestroy, OnInit } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { AuthError } from '@firebase/auth';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { AppState } from '../app.store';
import { IncomeExpense } from '../models/incomeExpenses.model';
import { User } from '../models/user.model';
import { IncomeExpenseService } from '../services/incomeExpense.service';


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
  private user!: User | null;
  private userSubscription!: Subscription;

  constructor(
    private fb: NonNullableFormBuilder,
    private store: Store<AppState>,
    private incoExService: IncomeExpenseService
  ) { }

  ngOnInit(): void {
    this.userSubscription = this.store.select('auth').subscribe(({ user }) => {
      this.user = user;
    })
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe()
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
      Swal.fire({
        title: 'Saving...',
        didOpen: () => {
          Swal.showLoading(null)
        }
      })
      const { amount, description } = this.incomeExpenseForm.value
      const newItem = new IncomeExpense(
        description, amount, this.hasIncomeOrExpense(), this.user?.id
      );

      try {
        await this.incoExService.createIncomeExpense(newItem);
        Swal.fire({
          icon: 'success',
          title: 'Saved',
          text: `${newItem.type} successfully added`,
          timer: 1_600
        })
        this.incomeExpenseForm.reset()
        // TODO: here we should dispatch an action into the store
      }
      catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Oops',
          text: (err as AuthError).message,
        })
      }
    }
  }
}
