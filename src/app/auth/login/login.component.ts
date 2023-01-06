import { Component } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AuthError } from 'firebase/auth';
import Swal from 'sweetalert2';


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

  async onLogUserIn(): Promise<void> {
    if (this.loginForm.invalid) {
      return
    }
    Swal.fire({
      text: 'Please wait',
      didOpen: () => {
        Swal.showLoading(null)
      }
    })
    try {
      const { email, password } = this.loginForm.value
      await this.authService.logUserIn({ email, password })
      Swal.close();
      this.router.navigateByUrl('/')
    }
    catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops',
        text: (error as AuthError).message,
      })
    }
    finally {
      this.loginForm.reset()
    }
  }
}
