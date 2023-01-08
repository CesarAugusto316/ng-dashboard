import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// components
import { AppComponent } from './app.component';

// firebase
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

// ngrx
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { appReducers } from './app.store';

// feature modules
import { AppRoutingModule } from './app-routing.module';
import { AuthModule } from './auth/auth.module';
import { IncomeExpenseModule } from './incomeExpense/income-expense.module';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    StoreModule.forRoot(appReducers),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),

    // feature modules
    AppRoutingModule,
    AuthModule,
    // IncomeExpenseModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
