import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { FirestoreError } from 'firebase/firestore';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private fireAuth: AngularFireAuth, private fireStore: AngularFirestore) { }

  /**
   * 
   * @description keeps track of userCredential state updates
   */
  initAuthListener(): void {
    this.fireAuth.authState.subscribe(user => {
      console.log(user);
    })
  }

  isAuth(): Observable<boolean> {
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
