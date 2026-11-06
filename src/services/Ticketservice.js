
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
    deleteTicket: builder.mutation({
      query: (id) => ({
        url: `/tickets/${id}`,
        method: 'DELETE',
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
  useDeleteTicketMutation,
} = ticketApi;

// Export tickets as Excel
export const exportTicketsExcel = async ({
  token,
  startDate,
  endDate,
}) => {
  const params = new URLSearchParams();

  if (startDate) {
    params.append('startDate', startDate);
  }

  if (endDate) {
    params.append('endDate', endDate);
  }

  const queryString = params.toString();

  const url = queryString
    ? `/api/export/tickets?${queryString}`
    : '/api/export/tickets';

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to export tickets.');
  }

  return response.blob();
};
