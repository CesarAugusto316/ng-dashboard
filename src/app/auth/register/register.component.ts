import { Component, OnDestroy, OnInit } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AuthError } from 'firebase/auth';
import Swal from 'sweetalert2';

// ngrx/store
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.store';
import * as uiActions from '../../shared/ui.actions'


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit, OnDestroy {

  registerForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.min(10_000_000)]]
  })
  isLoading = false;
  uiSubscription!: Subscription;

  constructor(
    private fb: NonNullableFormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>,
  ) { }

  ngOnInit(): void {
    this.uiSubscription = this.store.select('ui').subscribe(({ isLoading }) => {
      this.isLoading = isLoading;
    })
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe()
  }

  get name() {
    return this.registerForm.get('name')
  }

  get email() {
    return this.registerForm.get('email')
  }

  get password() {
    return this.registerForm.get('password')
  }

  public async registerUser(): Promise<void> {
    if (this.registerForm.invalid) {
      return
    }
    else {
      this.store.dispatch(uiActions.startLoading())

      try {
        const { email, name, password } = this.registerForm.value
        await this.authService.createUser({ name, email, password })
        this.registerForm.reset();
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
