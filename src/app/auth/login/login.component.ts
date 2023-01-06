import { Component, OnDestroy, OnInit } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AuthError } from 'firebase/auth';
import Swal from 'sweetalert2';

// store
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.store';
import * as uiActions from '../../shared/ui.actions';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.min(10_000_000)]]
  })
  isLoading = false;
  uiSubscription!: Subscription;

  constructor(
    private fb: NonNullableFormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.uiSubscription = this.store.select('ui').subscribe(({ isLoading }) => {
      this.isLoading = isLoading
    })
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  get email() {
    return this.loginForm.get('email')
  }

  get password() {
    return this.loginForm.get('password')
  }

  async onLogUserIn(): Promise<void> {
    if (this.loginForm.invalid) {
      return
    }
    else {
      this.store.dispatch(uiActions.startLoading())

      try {
        const { email, password } = this.loginForm.value
        await this.authService.logUserIn({ email, password })
        this.loginForm.reset()
        this.router.navigateByUrl('/')
      }
      catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Oops',
          text: (err as AuthError).message,
        })
        console.log(err);
      }
      finally {
        this.store.dispatch(uiActions.stopLoading())
      }
    }
  }
}
