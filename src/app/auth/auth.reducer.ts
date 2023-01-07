import { createReducer, on } from '@ngrx/store';
import { User } from '../models/user.model';
import { setUser, unSetUser } from './auth.actions';


export interface State {
  user: User | null;
}

export const initialState: State = {
  user: null,
}

export const authReducer = createReducer(initialState,
  on(setUser, (state, { user }) => ({ ...state, user })),
  on(unSetUser, (state) => initialState),
);
