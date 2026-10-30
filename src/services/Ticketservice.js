
import { api } from './api';

export const ticketApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMyTickets: builder.query({
      query: () => '/tickets/user',
      providesTags: ['Ticket'],
    }),

    getAllTickets: builder.query({
      query: () => '/tickets',
      providesTags: ['Ticket'],
    }),

    getActiveTickets: builder.query({
      query: () => '/tickets/active',
      providesTags: ['Ticket'],
    }),

    getAdminTickets: builder.query({
      query: () => '/admin/tickets',
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
    updateTicket: builder.mutation({
      query: ({ id, ...ticketData }) => ({
        url: `/tickets/${id}`,
        method: 'PUT',
        body: ticketData,
      }),
      invalidatesTags: ['Ticket'],
    }),
    updateTicketStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/tickets/${id}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['Ticket'],
    }),
    
    assignTicket: builder.mutation({
      query: ({ id, assignedToId }) => ({
        url: `/tickets/${id}/assign`,
        method: 'PUT',
        body: { assignedToId },
      }),
      invalidatesTags: ['Ticket'],
    }),
  }),
});

export const {
  useGetMyTicketsQuery,
  useGetAllTicketsQuery,
  useGetActiveTicketsQuery,
  useGetAdminTicketsQuery,
  useCreateTicketMutation,
  useUpdateTicketStatusMutation,
  useAssignTicketMutation,
} = ticketApi;
