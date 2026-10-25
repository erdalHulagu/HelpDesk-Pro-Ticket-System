
import { useEffect, useState } from 'react';
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

  const selectedTicket = ticketList.find(
    (ticket) => ticket.id === selectedTicketId
  );

  useEffect(() => {
    if (
      selectedTicketId !== null &&
      !ticketList.some((ticket) => ticket.id === selectedTicketId)
    ) {
      setSelectedTicketId(null);
    }
  }, [selectedTicketId, ticketList]);

  const handleStatusChange = async (event) => {
    if (!selectedTicket) return;

    try {
      await updateTicketStatus({
        id: selectedTicket.id,
        status: event.target.value,
      }).unwrap();
    } catch (error) {
      console.error('Unable to update ticket status:', error);
    }
  };

  const selectClassName =
    'mt-1 w-full rounded-lg border border-stone/70 bg-white px-3 py-2 text-sm text-charcoal outline-none transition focus:border-champagne focus:ring-2 focus:ring-champagne/30 disabled:cursor-not-allowed disabled:opacity-60 dark:border-[#55595D] dark:bg-[#292D31] dark:text-ivory';

  const labelClassName =
    'text-xs font-medium text-charcoal/65 dark:text-ivory/65';

  return (
    <section className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-stone/70 bg-white p-3 shadow-sm dark:border-[#55595D] dark:bg-[#34383C] sm:p-4 lg:col-span-2">
      <header className="mb-3 flex shrink-0 items-center justify-between gap-3 border-b border-stone/60 pb-3 dark:border-[#55595D]">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-charcoal/50 dark:text-ivory/50">
            Support workspace
          </p>
          <h2 className="mt-0.5 text-base font-semibold text-charcoal dark:text-ivory">
            Tickets
          </h2>
          <p className="mt-0.5 text-xs text-charcoal/60 dark:text-ivory/60">
            {isLoading
              ? 'Loading tickets...'
              : `${ticketList.length} ${
                  ticketList.length === 1 ? 'ticket' : 'tickets'
                }`}
          </p>
        </div>

        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-champagne/30 bg-champagne/10 text-lg text-champagne">
          ◈
        </span>
      </header>

      {isLoading && (
        <p className="py-4 text-sm text-charcoal/60 dark:text-ivory/60">
          Loading tickets...
        </p>
      )}

      {isError && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300"
        >
          Unable to load tickets. Please try again.
        </p>
      )}

      {!isLoading && !isError && ticketList.length === 0 && (
        <p className="py-6 text-center text-sm text-charcoal/60 dark:text-ivory/60">
          No tickets found.
        </p>
      )}

      {!isLoading && !isError && ticketList.length > 0 && (
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="ticket-scrollbar min-h-0 space-y-2 overflow-y-auto overscroll-contain pr-1">
            <p className="sticky top-0 z-10 bg-white/95 py-1 text-[10px] font-semibold uppercase tracking-wider text-charcoal/50 backdrop-blur dark:bg-[#34383C]/95 dark:text-ivory/50">
              All tickets
            </p>

            {ticketList.map((ticket) => {
              const isSelected = ticket.id === selectedTicketId;

              return (
                <button
                  key={ticket.id}
                  type="button"
                  onClick={() => setSelectedTicketId(ticket.id)}
                  aria-pressed={isSelected}
                  className={`block w-full rounded-xl text-left outline-none transition focus-visible:ring-2 focus-visible:ring-champagne ${
                    isSelected
                      ? 'rounded-xl ring-2 ring-champagne/70'
                      : 'hover:opacity-90'
                  }`}
                >
                  <TicketCard
                    ticket={ticket}
                    showCreator={showCreator}
                  />
                </button>
              );
            })}
          </div>

          <section
            aria-label="Selected ticket details"
            className="ticket-scrollbar min-h-0 overflow-y-auto rounded-xl border border-stone/60 bg-stone/10 p-3 dark:border-[#55595D] dark:bg-[#292D31]/50 sm:p-4"
          >
            {!selectedTicket ? (
              <div className="flex min-h-40 flex-col items-center justify-center px-4 py-8 text-center">
                <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-champagne/30 bg-champagne/10 text-xl text-champagne">
                  ◈
                </span>
                <h3 className="text-sm font-semibold text-charcoal dark:text-ivory">
                  Select a ticket
                </h3>
                <p className="mt-1 max-w-xs text-xs leading-5 text-charcoal/60 dark:text-ivory/60">
                  Choose a ticket from the list to view its details and comments.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="border-b border-stone/60 pb-3 dark:border-[#55595D]">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-charcoal/50 dark:text-ivory/50">
                    Ticket details
                  </p>
                  <h3 className="mt-1 break-words text-base font-semibold text-charcoal dark:text-ivory">
                    {selectedTicket.title || 'Untitled ticket'}
                  </h3>
                  <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-charcoal/75 dark:text-ivory/75">
                    {selectedTicket.description || 'No description provided.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  <div>
                    <label
                      htmlFor={`status-${selectedTicket.id}`}
                      className={labelClassName}
                    >
                      Status
                    </label>
                    <select
                      id={`status-${selectedTicket.id}`}
                      value={selectedTicket.status || 'OPEN'}
                      disabled={isUpdatingStatus}
                      onChange={handleStatusChange}
                      className={selectClassName}
                    >
                      <option value="OPEN">Open</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="RESOLVED">Resolved</option>
                      <option value="CLOSED">Closed</option>
                    </select>
                    {isUpdatingStatus && (
                      <p className="mt-1 text-xs text-charcoal/55 dark:text-ivory/55">
                        Updating status...
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor={`priority-${selectedTicket.id}`}
                      className={labelClassName}
                    >
                      Priority
                    </label>
                    <input
                      id={`priority-${selectedTicket.id}`}
                      value={selectedTicket.priority || 'LOW'}
                      readOnly
                      className={selectClassName}
                    />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-1 xl:col-span-2">
                    <label
                      htmlFor={`category-${selectedTicket.id}`}
                      className={labelClassName}
                    >
                      Category
                    </label>
                    <input
                      id={`category-${selectedTicket.id}`}
                      value={selectedTicket.category || ''}
                      readOnly
                      className={selectClassName}
                    />
                  </div>
                </div>

                {showCreator && (
                  <div className="rounded-lg border border-stone/60 px-3 py-2 dark:border-[#55595D]">
                    <p className={labelClassName}>Created by</p>
                    <p className="mt-1 break-words text-sm font-medium text-charcoal dark:text-ivory">
                      {selectedTicket.createdByUsername || 'Unknown'}
                    </p>
                    {selectedTicket.createdByRole && (
                      <p className="mt-1 text-xs text-charcoal/60 dark:text-ivory/60">
                        {selectedTicket.createdByRole.replaceAll('_', ' ')}
                      </p>
                    )}
                  </div>
                )}

                <div className="border-t border-stone/60 pt-3 dark:border-[#55595D]">
                  <h4 className="mb-3 text-sm font-semibold text-charcoal dark:text-ivory">
                    Comments
                  </h4>
                  <TicketComments
                    ticketId={selectedTicket.id}
                    token={token}
                  />
                </div>
              </div>
            )}
          </section>
        </div>
      )}
    </section>
  );
};

export default TicketList;
