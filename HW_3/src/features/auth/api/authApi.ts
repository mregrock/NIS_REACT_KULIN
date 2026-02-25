import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { LoginRequest, LoginResponse, User } from '../model/types';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://dummyjson.com/auth',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => {
        if (credentials.username === 'user' && credentials.password === 'password') {
          return {
            url: '/login',
            method: 'POST',
            body: { username: 'emilys', password: 'emilyspass', expiresInMins: credentials.expiresInMins },
          };
        }
        return {
          url: '/login',
          method: 'POST',
          body: credentials,
        };
      },
    }),
    me: builder.query<User, void>({
      query: () => '/me',
    }),
  }),
});

export const { useLoginMutation, useMeQuery } = authApi;
