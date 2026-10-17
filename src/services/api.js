
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',

  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
  }),

  tagTypes: ['User', 'Ticket', 'Comment', 'Attachment'],

  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),

   
register: builder.mutation({
  query: (userData) => ({
    url: '/auth/register',
    method: 'POST',
    body: userData,
    responseHandler: 'text',
  }),
}),

  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
} = api;
