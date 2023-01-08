import { Injectable, } from '@angular/core';
import { IncomeExpense } from '../models/incomeExpenses.model';
import { map } from 'rxjs';

// fireStore
import { AngularFirestore } from '@angular/fire/compat/firestore';


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

  /**
   * 
   * @@description watches updates in fireStore and will return 
   * to our client the latest snapshot.
   */
  initObserver(uid: string) {
    return this.firestore
      .collection<IncomeExpense>(`${uid}/income-expense/items`)
      .snapshotChanges()
      .pipe(
        map(snapShot => snapShot.map(doc => {
          return {
            ...doc.payload.doc.data(),
            docId: doc.payload.doc.id
          }
        })))
  }

  removeIcomeExpense(docId?: string, userID?: string): void {
    this.firestore.doc(`${userID}/income-expense/items/${docId}`).delete()
  }
}
