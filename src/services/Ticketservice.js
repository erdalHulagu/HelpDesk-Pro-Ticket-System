
import { api } from './api';

export const ticketApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMyTickets: builder.query({
      query: () => '/tickets/user',
      providesTags: ['Ticket'],
    }),

    createTicket: builder.mutation({
      query: (ticketData) => ({
        url: '/tickets',
        method: 'POST',
        body: ticketData,
      }),
      invalidatesTags: ['Ticket'],
    }),
  }),
});

export const {
  useGetMyTicketsQuery,
  useCreateTicketMutation,
} = ticketApi;
