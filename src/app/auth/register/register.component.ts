import { Component } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AuthError } from 'firebase/auth';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent {

  registerForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.min(10_000_000)]]
  })

  constructor(
    private fb: NonNullableFormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

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
      Swal.fire({
        text: 'Please wait',
        didOpen: () => {
          Swal.showLoading(null)
        }
      })
      try {
        const { email, name, password } = this.registerForm.value
        await this.authService.createUser({ name, email, password })
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
        this.registerForm.reset();
      }
    }
  }
}
