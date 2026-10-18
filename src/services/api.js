
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: '/api',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth?.token;

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  },
});

export const api = createApi({
  reducerPath: 'api',
  baseQuery,
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
    
createTicket: builder.mutation({
  query: (ticketData) => ({
    url: '/tickets',
    method: 'POST',
    body: ticketData,
  }),
}),


    getMyTickets: builder.query({
      query: () => '/tickets/user',
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetMyTicketsQuery,
} = api;
