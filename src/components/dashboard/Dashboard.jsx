
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { useGetMyTicketsQuery } from '../../services/ticketService';

const Dashboard = ({ darkMode, onToggleTheme }) => {
  const { username } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const {
    data: tickets,
    isLoading,
    isError,
  } = useGetMyTicketsQuery();

  return (
    <main className="flex h-dvh flex-col overflow-hidden bg-ivory p-3 text-charcoal dark:bg-[#25282B] dark:text-ivory sm:p-5">
      {/* Header */}
      <header className="mx-auto flex w-full max-w-6xl shrink-0 items-center justify-between gap-3 pb-4">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-widest text-champagne">
            Helpdesk Portal
          </p>

          <h1 className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">
            Welcome back, {username}!
          </h1>

          <p className="mt-1 text-sm text-charcoal/65 dark:text-ivory/65">
            Manage your support requests.
          </p>
        </div>

        
<div className="flex shrink-0 items-center gap-2">
  <button
    type="button"
    onClick={onToggleTheme}
    aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    className="flex h-9 w-9 items-center justify-center rounded-lg border border-stone text-sm transition hover:bg-stone/30 dark:border-[#55595D] dark:hover:bg-white/10"
  >
    <span aria-hidden="true">
      {darkMode ? '☀️' : '🌙'}
    </span>
  </button>

  <button
    onClick={() => dispatch(logout())}
    className="rounded-lg border border-stone px-3 py-2 text-sm font-medium transition hover:bg-white dark:border-[#55595D] dark:hover:bg-[#34383C] sm:px-4"
  >
    Sign Out
  </button>
</div>

      </header>

      {/* Main content */}
      <section className="mx-auto grid min-h-0 w-full max-w-6xl flex-1 grid-rows-[minmax(0,1fr)_auto] gap-3 lg:grid-cols-3 lg:grid-rows-1 lg:gap-4">

        {/* Ticket panel */}
        <div className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-stone/70 bg-white p-4 shadow-sm dark:border-[#55595D] dark:bg-[#34383C] sm:p-5 lg:col-span-2">
          <div className="flex shrink-0 items-center justify-between gap-3 border-b border-stone/60 pb-3 dark:border-[#55595D]">
            <div>
              <p className="text-sm text-charcoal/60 dark:text-ivory/60">
                My Tickets
              </p>

              <h2 className="mt-1 text-2xl font-semibold">
                {Array.isArray(tickets) ? tickets.length : 0}
              </h2>
            </div>

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-champagne/20 text-xl">
              ◈
            </div>
          </div>

          {/* Only this list scrolls */}
          <div className="mt-3 min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-contain pr-1">
            {isLoading && (
              <p className="py-3 text-sm text-charcoal/65 dark:text-ivory/65">
                Loading tickets...
              </p>
            )}

            {isError && (
              <p className="py-3 text-sm text-red-600">
                Unable to load tickets.
              </p>
            )}

            {Array.isArray(tickets) && tickets.length === 0 && !isLoading && (
              <p className="py-4 text-sm text-charcoal/65 dark:text-ivory/65">
                You have no tickets yet.
              </p>
            )}

            {Array.isArray(tickets) && tickets.map((ticket) => (
              <article
                key={ticket.id}
                className="rounded-lg border border-stone/70 p-3 transition hover:border-champagne/70 dark:border-[#55595D]"
              >
                <div className="flex min-w-0 flex-col justify-between gap-2 sm:flex-row sm:items-center">
                  <div className="min-w-0">
                    <h3 className="break-words text-sm font-semibold">
                      {ticket.title}
                    </h3>

                    <p className="mt-1 break-words text-xs text-charcoal/60 dark:text-ivory/60">
                      Ticket : {ticket.id} - {ticket.category} -
                    </p>
                  </div>

                  <span
                    className={`w-fit shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                      ticket.status === 'CLOSED'
                        ? 'bg-green-100 text-green-800'
                        : ticket.status === 'IN_PROGRESS'
                        ? 'bg-blue-100 text-blue-800'
                        : ticket.status === 'RESOLVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {ticket.status.replaceAll('_', ' ')}
                  </span>
                </div>

                {ticket.description && (
                  <p className="mt-2 break-words text-sm leading-5 text-charcoal/70 dark:text-ivory/70">
                    {ticket.description}
                  </p>
                )}
              </article>
            ))}
          </div>
        </div>

        {/* Compact action cards */}
        <div className="grid grid-cols-2 gap-3 lg:flex lg:min-h-0 lg:flex-col">
          <button
            type="button"
            className="min-w-0 rounded-xl border border-stone/70 bg-white p-3 text-left transition hover:border-champagne hover:shadow-sm dark:border-[#55595D] dark:bg-[#34383C] sm:p-4 lg:flex-1"
          >
            <p className="text-xs text-charcoal/60 dark:text-ivory/60">
              Support
            </p>

            <h2 className="mt-1 text-sm font-semibold sm:text-base">
              Create a Ticket
            </h2>

            <p className="mt-1 hidden text-xs text-charcoal/65 dark:text-ivory/65 sm:block">
              Get help with a technical issue.
            </p>
          </button>

          <div className="min-w-0 rounded-xl border border-stone/70 bg-white p-3 dark:border-[#55595D] dark:bg-[#34383C] sm:p-4 lg:flex-1">
            <p className="text-xs text-charcoal/60 dark:text-ivory/60">
              Account
            </p>

            <h2 className="mt-1 text-sm font-semibold sm:text-base">
              My Profile
            </h2>

            <p className="mt-1 hidden text-xs text-charcoal/65 dark:text-ivory/65 sm:block">
              Review your account information.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
