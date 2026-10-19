
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import {
  useGetMyTicketsQuery,
  useCreateTicketMutation,
} from '../../services/ticketService';

const Dashboard = ({ darkMode, onToggleTheme }) => {
  const { username } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const {
    data: tickets,
    isLoading,
    isError,
  } = useGetMyTicketsQuery();

  const [createTicket, { isLoading: isCreating }] =
    useCreateTicketMutation();

  const [activeSection, setActiveSection] = useState('dashboard');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'SOFTWARE',
    priority: 'MEDIUM',
  });

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Calculate ticket statistics from the existing ticket list.
  const ticketList = Array.isArray(tickets) ? tickets : [];

  const ticketStats = [
    {
      label: 'Total Tickets',
      value: ticketList.length,
      marker: '◈',
      accent: 'bg-champagne/15 text-champagne',
    },
    {
      label: 'Open',
      value: ticketList.filter((ticket) => ticket.status === 'OPEN').length,
      marker: '○',
      accent:
        'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    },
    {
      label: 'In Progress',
      value: ticketList.filter(
        (ticket) => ticket.status === 'IN_PROGRESS'
      ).length,
      marker: '↗',
      accent:
        'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    },
    {
      label: 'Resolved',
      value: ticketList.filter(
        (ticket) => ticket.status === 'RESOLVED'
      ).length,
      marker: '✓',
      accent:
        'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    },
  ];

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setFormError('');
    setFormSuccess('');
  };

  const handleCreateTicket = async (event) => {
    event.preventDefault();

    setFormError('');
    setFormSuccess('');

    if (!formData.title.trim() || !formData.description.trim()) {
      setFormError('Please enter a title and description.');
      return;
    }

    try {
      await createTicket({
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        priority: formData.priority,
      }).unwrap();

      setFormSuccess('Ticket created successfully!');

      setFormData({
        title: '',
        description: '',
        category: 'SOFTWARE',
        priority: 'MEDIUM',
      });
    } catch (error) {
      setFormError(
        typeof error?.data === 'string'
          ? error.data
          : error?.data?.message ||
              'Unable to create ticket. Please try again.'
      );
    }
  };

  return (
    <main className="flex h-dvh flex-col overflow-hidden bg-ivory p-3 text-charcoal dark:bg-[#25282B] dark:text-ivory sm:p-5">
      {/* Dashboard header */}
      <header className="mx-auto flex w-full max-w-6xl shrink-0 items-center justify-between gap-4 border-b border-stone/70 pb-4 dark:border-[#55595D] sm:pb-5">
        <div className="min-w-0 border-l-2 border-champagne pl-3 sm:pl-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-champagne sm:text-xs">
            Helpdesk Portal
          </p>

          <h1 className="mt-1.5 break-words text-lg font-semibold tracking-tight sm:text-2xl">
            Welcome back, {username}!
          </h1>

          <p className="mt-1 text-xs text-charcoal/60 dark:text-ivory/60 sm:text-sm">
            Manage your support requests.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={
              darkMode ? 'Switch to light mode' : 'Switch to dark mode'
            }
            title={
              darkMode ? 'Switch to light mode' : 'Switch to dark mode'
            }
            className="flex h-9 w-9 items-center justify-center rounded-full border border-stone/80 bg-white/60 text-sm transition duration-200 hover:border-champagne hover:bg-champagne/10 dark:border-[#55595D] dark:bg-[#34383C] dark:hover:border-champagne"
          >
            <span aria-hidden="true">
              {darkMode ? '☀️' : '🌙'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => dispatch(logout())}
            className="rounded-full border border-champagne/70 px-3 py-2 text-xs font-semibold transition duration-200 hover:bg-champagne hover:text-white dark:hover:text-[#25282B] sm:px-4"
          >
            Sign Out
          </button>
        </div>
      </header>

      <section className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col pt-3 sm:pt-4">
        {activeSection === 'dashboard' && (
          <div className="flex min-h-0 flex-1 flex-col gap-3 sm:gap-4">
            {/* Ticket statistics */}
            <div className="grid shrink-0 grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
              {ticketStats.map((stat) => (
                <article
                  key={stat.label}
                  className="min-w-0 rounded-xl border border-stone/70 bg-white p-3 shadow-sm transition duration-200 hover:border-champagne/70 dark:border-[#55595D] dark:bg-[#34383C] sm:p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-xs font-medium text-charcoal/60 dark:text-ivory/60 sm:text-sm">
                      {stat.label}
                    </p>

                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-sm font-semibold ${stat.accent}`}
                      aria-hidden="true"
                    >
                      {stat.marker}
                    </span>
                  </div>

                  <p className="mt-2 text-2xl font-semibold tracking-tight sm:mt-3 sm:text-3xl">
                    {isLoading ? '—' : isError ? '—' : stat.value}
                  </p>

                  <div className="mt-2 h-0.5 w-9 rounded-full bg-champagne/70" />
                </article>
              ))}
            </div>

            {/* Main dashboard content */}
            <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)_auto] gap-3 lg:grid-cols-3 lg:grid-rows-1 lg:gap-4">
              {/* My Tickets */}
              <div className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-stone/70 bg-white p-3.5 shadow-sm dark:border-[#55595D] dark:bg-[#34383C] sm:p-5 lg:col-span-2">
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
                      <p className="mt-2 text-sm font-medium">
                        No tickets yet
                      </p>
                      <p className="mt-1 text-xs text-charcoal/60 dark:text-ivory/60">
                        Create a ticket when you need technical support.
                      </p>
                    </div>
                  )}

                  {ticketList.map((ticket) => (
                    <article
                      key={ticket.id}
                      className="group relative overflow-hidden rounded-xl border border-stone/60 bg-white/80 p-3.5 shadow-sm transition-all duration-200 hover:border-champagne/70 hover:shadow-md dark:border-[#55595D] dark:bg-[#34383C]"
                    >
                      <div
                        className={`absolute bottom-3 left-0 top-3 w-0.5 rounded-r-full ${
                          ticket.priority === 'CRITICAL'
                            ? 'bg-red-500'
                            : ticket.priority === 'HIGH'
                              ? 'bg-orange-400'
                              : ticket.priority === 'MEDIUM'
                                ? 'bg-champagne'
                                : 'bg-emerald-500/70'
                        }`}
                      />

                      <div className="pl-2">
                        <div className="flex min-w-0 flex-col justify-between gap-2 sm:flex-row sm:items-center">
                          <div className="min-w-0">
                            <h3 className="break-words text-sm font-semibold">
                              {ticket.title}
                            </h3>

                            <p className="mt-1 break-words text-xs text-charcoal/60 dark:text-ivory/60">
                              Ticket : {ticket.id} · {ticket.category}
                            </p>
                          </div>

                          <span
                            className={`w-fit shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                              ticket.status === 'CLOSED'
                                ? 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200'
                                : ticket.status === 'IN_PROGRESS'
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                                  : ticket.status === 'RESOLVED'
                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                                    : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                            }`}
                          >
                            {ticket.status?.replaceAll('_', ' ')}
                          </span>
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span className="text-xs text-charcoal/60 dark:text-ivory/60">
                            Priority:
                          </span>

                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                              ticket.priority === 'CRITICAL'
                                ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
                                : ticket.priority === 'HIGH'
                                  ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300'
                                  : ticket.priority === 'MEDIUM'
                                    ? 'bg-[#f4ead4] text-[#80643a] dark:bg-[#514633] dark:text-[#e6cb99]'
                                    : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200'
                            }`}
                          >
                            {ticket.priority || 'LOW'}
                          </span>
                        </div>

                        {ticket.description && (
                          <p className="mt-2 break-words text-sm leading-5 text-charcoal/70 dark:text-ivory/70">
                            {ticket.description}
                          </p>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              {/* Quick actions and account */}
              <div className="grid grid-cols-2 gap-3 lg:flex lg:min-h-0 lg:flex-col">
                <button
                  type="button"
                  onClick={() => {
                    setFormError('');
                    setFormSuccess('');
                    setActiveSection('createTicket');
                  }}
                  className="group min-w-0 rounded-xl border border-stone/70 bg-white p-3 text-left transition duration-200 hover:border-champagne hover:shadow-sm dark:border-[#55595D] dark:bg-[#34383C] sm:p-4 lg:flex-1"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-champagne/15 text-lg text-champagne transition group-hover:bg-champagne/25">
                    +
                  </span>
                  <p className="mt-3 text-xs font-medium text-charcoal/60 dark:text-ivory/60">
                    Support
                  </p>
                  <h2 className="mt-1 text-sm font-semibold sm:text-base">
                    Create a Ticket
                  </h2>
                  <p className="mt-1 hidden text-xs leading-5 text-charcoal/65 dark:text-ivory/65 sm:block">
                    Get help with a technical issue.
                  </p>
                </button>

                <div className="min-w-0 rounded-xl border border-stone/70 bg-white p-3 dark:border-[#55595D] dark:bg-[#34383C] sm:p-4 lg:flex-1">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-champagne/15 text-lg text-champagne">
                    ♙
                  </span>
                  <p className="mt-3 text-xs font-medium text-charcoal/60 dark:text-ivory/60">
                    Account
                  </p>
                  <h2 className="mt-1 text-sm font-semibold sm:text-base">
                    My Profile
                  </h2>
                  <p className="mt-1 hidden text-xs leading-5 text-charcoal/65 dark:text-ivory/65 sm:block">
                    Review your account information.
                  </p>
                  <p className="mt-2 break-words text-xs text-charcoal/55 dark:text-ivory/55">
                    {username}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create ticket section */}
        {activeSection === 'createTicket' && (
          <div className="ticket-scrollbar min-h-0 flex-1 overflow-y-auto rounded-xl border border-stone/70 bg-white p-4 shadow-sm dark:border-[#55595D] dark:bg-[#34383C] sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-champagne">
                  Support
                </p>
                <h2 className="mt-1 text-xl font-semibold">
                  Create a Ticket
                </h2>
                <p className="mt-1 text-sm text-charcoal/60 dark:text-ivory/60">
                  Tell us about the issue you are experiencing.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveSection('dashboard')}
                className="shrink-0 rounded-full border border-stone px-3 py-2 text-xs font-medium transition hover:border-champagne hover:bg-champagne/10 dark:border-[#55595D] sm:text-sm"
              >
                Back
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="max-w-3xl space-y-4">
              <div>
                <label
                  htmlFor="ticket-title"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Title
                </label>
                <input
                  id="ticket-title"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  required
                  maxLength={150}
                  placeholder="Enter ticket title"
                  className="w-full rounded-lg border border-stone bg-transparent px-3 py-2.5 text-sm outline-none transition focus:border-champagne focus:ring-2 focus:ring-champagne/15 dark:border-[#55595D]"
                />
              </div>

              <div>
                <label
                  htmlFor="ticket-description"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Description
                </label>
                <textarea
                  id="ticket-description"
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  required
                  rows={4}
                  placeholder="Describe your issue"
                  className="w-full resize-y rounded-lg border border-stone bg-transparent px-3 py-2.5 text-sm outline-none transition focus:border-champagne focus:ring-2 focus:ring-champagne/15 dark:border-[#55595D]"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="ticket-category"
                    className="mb-1.5 block text-sm font-medium"
                  >
                    Category
                  </label>
                  <select
                    id="ticket-category"
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    className="w-full rounded-lg border border-stone bg-transparent px-3 py-2.5 text-sm outline-none transition focus:border-champagne focus:ring-2 focus:ring-champagne/15 dark:border-[#55595D]"
                  >
                    <option value="HARDWARE">Hardware</option>
                    <option value="SOFTWARE">Software</option>
                    <option value="ACCESS_REQUEST">Access Request</option>
                    <option value="NETWORK">Network</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="ticket-priority"
                    className="mb-1.5 block text-sm font-medium"
                  >
                    Priority
                  </label>
                  <select
                    id="ticket-priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleFormChange}
                    className="w-full rounded-lg border border-stone bg-transparent px-3 py-2.5 text-sm outline-none transition focus:border-champagne focus:ring-2 focus:ring-champagne/15 dark:border-[#55595D]"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>
              </div>

              {formError && (
                <p role="alert" className="text-sm text-red-600 dark:text-red-400">
                  {formError}
                </p>
              )}

              {formSuccess && (
                <p role="status" className="text-sm text-emerald-700 dark:text-emerald-400">
                  {formSuccess}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isCreating}
                  className="rounded-full bg-charcoal px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-champagne dark:text-charcoal"
                >
                  {isCreating ? 'Creating...' : 'Submit Ticket'}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSection('dashboard')}
                  className="rounded-full border border-stone px-5 py-2.5 text-sm font-medium transition hover:border-champagne hover:bg-champagne/10 dark:border-[#55595D]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </section>
    </main>
  );
};

export default Dashboard;
