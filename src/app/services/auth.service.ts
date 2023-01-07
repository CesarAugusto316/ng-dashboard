import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable, take } from 'rxjs';
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
    private store: Store<AppState>
  ) { }

  /**
   * 
   * @description keeps track of user authentication state updates
   * and is in sync with the ngrxStore.
   */
  initAuthObserver(): void {
    // fires on user sign-in/up/out
    this.fireAuth.authState.subscribe((user) => {
      // sign-in/up
      if (user) {
        this.fireStore
          // 1. reading fireStore collection by doc.uid
          .doc<User>(`${user.uid}/user`).valueChanges().pipe(take(1))
          .subscribe((doc: any) => {
            // 2. dispatching action in the store and setting user
            this.store.dispatch(
              authActions.setUser(
                { user: new User(user.uid, user.email, doc?.name) }
              )
            );
          })
      } // sign-out
      else {
        this.store.dispatch(authActions.unSetUser())
      }
    })
  }

  /**
   * 
   * @description can be consumed by other services like auth.guard
   */
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
      await this.fireStore.doc(`${newUser.id}/user`).set({ ...newUser });
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
