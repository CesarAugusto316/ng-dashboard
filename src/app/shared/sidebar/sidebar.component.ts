import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.store';
import { AuthService } from 'src/app/services/auth.service';
import * as authActions from '../../auth/auth.actions';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) { }

  async onLogOut() {
    this.store.dispatch(authActions.unSetUser())
    try {
      await this.authService.logOut();
      this.router.navigateByUrl('/login')
    }
    catch (error) {
      console.log(error);
    }
  }
}
