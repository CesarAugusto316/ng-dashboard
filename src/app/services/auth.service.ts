import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private fireAuth: AngularFireAuth) { }

  async createUser(user: { name?: string, email?: string, password?: string }) {
    return this.fireAuth
      .createUserWithEmailAndPassword(user.email as string, user.password as string)
  }

  async logUser(user: { email?: string, password?: string }) {
    return this.fireAuth
      .signInWithEmailAndPassword(user.email as string, user.password as string)
  }
}
