import { Injectable, } from '@angular/core';
import { IncomeExpense } from '../models/incomeExpenses.model';

// fireStore
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class IncomeExpenseService {

  constructor(
    private firestore: AngularFirestore,
  ) { }

  async addIncomeExpense(incomeExpense: IncomeExpense) {
    return this.firestore
      .doc(`${incomeExpense.docId}/income-expense`)
      .collection('items')
      .add({ ...incomeExpense })
  }

  initObserver(uid: string) {
    return this.firestore
      .collection<IncomeExpense>(`${uid}/income-expense/items`)
      .snapshotChanges()
      .pipe(
        map(snapShot => snapShot.map(doc => {
          return {
            docId: doc.payload.doc.id,
            ...doc.payload.doc.data()
          }
        })))
  }

  remove(docId?: string, userID?: string): void {
    this.firestore.doc(`${userID}/income-expense/items/${docId}`).delete()
  }
}
