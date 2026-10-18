
import { api } from './api';

export const ticketService = {
  getMyTickets: () => api.endpoints.getMyTickets.initiate(),

  createTicket: (ticketData) =>
    api.endpoints.createTicket.initiate(ticketData),
};
