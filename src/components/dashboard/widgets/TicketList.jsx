
import TicketCard from './TicketCard';
import { useSelector } from 'react-redux';

const TicketList = ({ tickets, isLoading, isError }) => {
  const role = useSelector((state) => state.auth.role);
const showCreator = role === 'ADMIN' || role === 'IT_MANAGER';
  const ticketList = Array.isArray(tickets) ? tickets : [];

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
          <p
            role="alert"
            className="py-3 text-sm text-red-600 dark:text-red-400"
          >
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
         <TicketCard
  key={ticket.id}
  ticket={ticket}
  showCreator={showCreator}
/>
        ))}
      </div>
    </section>
  );
};

export default TicketList;
