import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IncomeExpense } from '../models/incomeExpenses.model';


@Injectable({
  providedIn: 'root'
})
export class IncomeExpenseService {

  constructor(private firestore: AngularFirestore) { }

  createIncomeExpense(incomeExpense: IncomeExpense) {
    return this.firestore
      .doc(`${incomeExpense.uid}/income-expense`)
      .collection('items')
      .add({ ...incomeExpense })
  }
}
