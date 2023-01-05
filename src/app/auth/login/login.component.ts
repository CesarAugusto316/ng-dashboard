import { Component } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.min(10_000_000)]]
  })

  constructor(
    private fb: NonNullableFormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  get email() {
    return this.loginForm.get('email')
  }

  get password() {
    return this.loginForm.get('password')
  }

  async logUser(): Promise<void> {
    if (this.loginForm.invalid) {
      return
    }
    try {
      const { email, password } = this.loginForm.value
      this.authService.logUser({ email, password })
      this.router.navigateByUrl('/')
    }
    catch (error) {
      console.log(error);
    }
    finally {
      this.loginForm.reset()
      console.log(this.loginForm.value);
    }
  }
}
