import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.store';
import { IncomeExpense } from 'src/app/models/incomeExpenses.model';
import { User } from 'src/app/models/user.model';
import { IncomeExpenseService } from 'src/app/services/incomeExpense.service';


@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
})
export class DetailComponent implements OnInit, OnDestroy {
  incomeExpenses!: IncomeExpense[];
  user!: User | null;

  private inExsSubs!: Subscription;

  constructor(
    private store: Store<AppState>,
    private inExService: IncomeExpenseService
  ) { }

  ngOnInit(): void {
    this.inExsSubs = this.store.subscribe(({ incomExpenses, auth }) => {
      this.incomeExpenses = incomExpenses.items;
      this.user = auth.user;
    })
  }

  ngOnDestroy(): void {
    this.inExsSubs.unsubscribe()
  }

  removeItem(docId?: string): void {
    this.inExService.removeIcomeExpense(docId, this.user?.id)
  }
}
