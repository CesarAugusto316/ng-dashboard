import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable, Subscription } from 'rxjs';
import { User } from '../models/user.model';
import { FirestoreError } from '@angular/fire/firestore';

// ngrx/store
import { Store } from '@ngrx/store';
import { AppState } from '../app.store';
import * as authActions from '../auth/auth.actions'


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private fireAuth: AngularFireAuth,
    private fireStore: AngularFirestore,
    private ngRxStore: Store<AppState>
  ) { }

  fireSubscription!: Subscription;

  /**
   * 
   * @description keeps track of userCredential authentication state updates
   * and logs every change to the console.
   */
  initAuthListener(): void {
    this.fireAuth.authState.subscribe(user => {
      if (user) {
        this.fireSubscription = this.fireStore
          // 1. reading fireStore doc by uid and subscribing
          .doc(`${user.uid}/user`).valueChanges()
          .subscribe((doc: any) => {
            // 2. dispatching action in the store
            this.ngRxStore.dispatch(
              authActions.setUser({ user: new User(user.uid, user?.email, doc.name) })
            );
          })
      } else {
        // 3. when loging out unSet the user from store and cancel any subscription
        this.fireSubscription.unsubscribe();
        this.ngRxStore.dispatch(authActions.unSetUser())
      }
    })
  }

  isAuthenticated(): Observable<boolean> {
    return this.fireAuth.authState.pipe(map(user => user ? true : false));
  }

  async createUser(user: { name?: string, email?: string, password?: string }) {
    try {
      // 1. creates a user for authentication
      const res = await this.fireAuth.createUserWithEmailAndPassword(
        user.email as string, user.password as string
      );
      const newUser = new User(res.user?.uid as string, user.name as string, user.email as string);

      // 2. stores the user data in firebase
      await this.fireStore.doc(`${newUser.userId}/user`).set({ ...newUser });
      return Promise.resolve(newUser)
    }
    catch (err) {
      return Promise.reject(err as FirestoreError)
    }
  }

  async logUserIn(user: { email?: string, password?: string }) {
    return new Promise((resolve, reject) => {
      this.fireAuth
        .signInWithEmailAndPassword(user.email as string, user.password as string)
        .then((res) => resolve(res))
        .catch((err) => reject(err))
    })
  }

  async logOut() {
    return this.fireAuth.signOut();
  }
}
