import { useState } from 'react';
import { useSelector } from 'react-redux';
import TicketCard from './TicketCard';
import TicketComments from '../tickets/TicketComments.jsx';
import { useUpdateTicketStatusMutation } from '../../../services/ticketService.js';

const TicketList = ({ tickets, isLoading, isError }) => {
  const role = useSelector((state) => state.auth.role);
  const token = useSelector((state) => state.auth.token);

  const showCreator = role === 'ADMIN' || role === 'IT_MANAGER';
  const ticketList = Array.isArray(tickets) ? tickets : [];

  const [selectedTicketId, setSelectedTicketId] = useState(null);
const [updateTicketStatus, { isLoading: isUpdatingStatus }] =
  useUpdateTicketStatusMutation();
  /*const selectedTicket = ticketList.find(
    (ticket) => ticket.id === selectedTicketId
  );*/

  return (
    <section className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-stone/70 bg-white p-3.5 shadow-sm dark:border-[#55595D] dark:bg-[#34383C] sm:p-5 lg:col-span-2">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-stone/60 pb-3 dark:border-[#55595D]">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-charcoal/55 dark:text-ivory/55">
            Support overview
          </p>
          <h2 className="mt-1 text-lg font-semibold sm:text-xl">
            My Tickets
          </h2>
          <p className="mt-1 text-xs text-charcoal/60 dark:text-ivory/60">
            {isLoading
              ? 'Loading your requests...'
              : `${ticketList.length} total ${
                  ticketList.length === 1 ? 'ticket' : 'tickets'
                }`}
          </p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-champagne/30 bg-champagne/10 text-xl text-champagne">
          ◈
        </div>
      </div>

      <div className="ticket-scrollbar mt-3 min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-contain pr-1">
        {isLoading && (
          <p className="py-3 text-sm text-charcoal/65 dark:text-ivory/65">
            Loading tickets...
          </p>
        )}

        {isError && (
          <p role="alert" className="py-3 text-sm text-red-600 dark:text-red-400">
            Unable to load tickets. Please try again.
          </p>
        )}

        {!isLoading && !isError && ticketList.length === 0 && (
          <div className="flex min-h-32 flex-col items-center justify-center px-4 py-6 text-center">
            <span className="text-2xl text-champagne" aria-hidden="true">
              ◈
            </span>
            <p className="mt-2 text-sm font-medium">No tickets yet</p>
            <p className="mt-1 text-xs text-charcoal/60 dark:text-ivory/60">
              Create a ticket when you need technical support.
            </p>
          </div>
        )}

        {ticketList.map((ticket) => (
          <div key={ticket.id}>
            <button
              type="button"
              onClick={() =>
                setSelectedTicketId((currentId) =>
                  currentId === ticket.id ? null : ticket.id
                )
              }
              aria-expanded={selectedTicketId === ticket.id}
              className="block w-full rounded-xl text-left focus:outline-none focus:ring-2 focus:ring-champagne"
            >
              <TicketCard
                ticket={ticket}
                showCreator={showCreator}
              />
            </button>

            {selectedTicketId === ticket.id && (
              <div className="mt-2 rounded-xl border border-stone/60 p-3 dark:border-[#55595D]">
                <h3 className="mb-2 text-sm font-semibold">
                  Ticket Details
                </h3>
<div className="mt-4 space-y-3">
  <label className="block text-sm font-medium" htmlFor={`status-${ticket.id}`}>
    Status
  </label>

  <select
    id={`status-${ticket.id}`}
    value={ticket.status || 'OPEN'}
    disabled={isUpdatingStatus}
    onChange={async (event) => {
      try {
        await updateTicketStatus({
          id: ticket.id,
          status: event.target.value,
        }).unwrap();
      } catch (error) {
        console.error('Unable to update ticket status:', error);
      }
    }}
    className="w-full rounded-lg border border-stone/70 bg-white p-2 text-sm dark:border-[#55595D] dark:bg-[#25282B]"
  >
    <option value="OPEN">Open</option>
    <option value="IN_PROGRESS">In Progress</option>
    <option value="RESOLVED">Resolved</option>
    <option value="CLOSED">Closed</option>
  </select>

  {isUpdatingStatus && (
    <p className="text-xs text-charcoal/60 dark:text-ivory/60">
      Updating status...
    </p>
  )}

  <label className="block text-sm font-medium" htmlFor={`priority-${ticket.id}`}>
    Priority
  </label>

  <select
    id={`priority-${ticket.id}`}
    value={ticket.priority || 'MEDIUM'}
    disabled
    className="w-full rounded-lg border border-stone/70 bg-white p-2 text-sm opacity-70 dark:border-[#55595D] dark:bg-[#25282B]"
  >
    <option value="LOW">Low</option>
    <option value="MEDIUM">Medium</option>
    <option value="HIGH">High</option>
    <option value="CRITICAL">Critical</option>
  </select>

  <label className="block text-sm font-medium" htmlFor={`category-${ticket.id}`}>
    Category
  </label>

  <input
    id={`category-${ticket.id}`}
    value={ticket.category || ''}
    readOnly
    className="w-full rounded-lg border border-stone/70 bg-white p-2 text-sm opacity-70 dark:border-[#55595D] dark:bg-[#25282B]"
  />
</div>
                <p className="mb-3 whitespace-pre-wrap break-words text-sm text-charcoal/70 dark:text-ivory/70">
                  {ticket.description || 'No description provided.'}
                </p>

                <TicketComments
                  ticketId={ticket.id}
                  token={token}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default TicketList;
