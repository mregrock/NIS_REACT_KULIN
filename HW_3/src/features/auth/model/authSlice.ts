import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from './types';
import { authApi } from '../api/authApi';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        authApi.endpoints.login.matchFulfilled,
        (state, action: PayloadAction<User>) => {
          state.user = action.payload;
          state.token = action.payload.token;
          state.isAuthenticated = true;
          localStorage.setItem('token', action.payload.token);
        }
      )
      .addMatcher(
        authApi.endpoints.me.matchFulfilled,
        (state, action: PayloadAction<User>) => {
          state.user = action.payload;
          state.isAuthenticated = true;
        }
      );
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
