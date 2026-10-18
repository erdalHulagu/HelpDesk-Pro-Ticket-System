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

    if (
      !formData.title.trim() ||
      !formData.description.trim()
    ) {
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

        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={
              darkMode
                ? 'Switch to light mode'
                : 'Switch to dark mode'
            }
            title={
              darkMode
                ? 'Switch to light mode'
                : 'Switch to dark mode'
            }
            className="flex h-8 w-8 items-center justify-center rounded-md border border-stone/80 text-xs transition hover:bg-stone/30 dark:border-[#55595D] dark:hover:bg-white/10"
          >
            <span aria-hidden="true">
              {darkMode ? '☀️' : '🌙'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => dispatch(logout())}
            className="rounded-md border border-stone/80 px-2.5 py-1.5 text-xs font-medium transition hover:bg-white dark:border-[#55595D] dark:hover:bg-[#34383C]"
          >
            Sign Out
          </button>
        </div>
      </header>

      <section className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col">
        {activeSection === 'dashboard' && (
          <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)_auto] gap-3 lg:grid-cols-3 lg:grid-rows-1 lg:gap-4">
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

              <div className="mt-3 min-h-0 flex-1 space-y-2 overflow-y-auto ticket-scrollbar overscroll-contain pr-1">
                {isLoading && (
                  <p className="py-3 text-sm text-charcoal/65 dark:text-ivory/65">
                    Loading tickets...
                  </p>
                )}

                {isError && (
                  <p role="alert" className="py-3 text-sm text-red-600">
                    Unable to load tickets.
                  </p>
                )}

                {Array.isArray(tickets) &&
                  tickets.length === 0 &&
                  !isLoading && (
                    <p className="py-4 text-sm text-charcoal/65 dark:text-ivory/65">
                      You have no tickets yet.
                    </p>
                  )}

                {Array.isArray(tickets) &&
                  tickets.map((ticket) => (
                    <article
                      key={ticket.id}
                      className="group relative overflow-hidden rounded-xl border border-stone/60 bg-white/80 p-3.5 shadow-sm transition-all duration-200 hover:border-champagne/70 hover:shadow-md dark:border-[#55595D] dark:bg-[#34383C]"
                    >
                      {/* Elegant priority indicator */}
                      <div
                        className={`absolute bottom-3 left-0 top-3 w-1 rounded-r-full ${
                          ticket.priority === 'CRITICAL'
                            ? 'bg-red-500'
                            : ticket.priority === 'HIGH'
                              ? 'bg-orange-400'
                              : ticket.priority === 'MEDIUM'
                                ? 'bg-amber-300'
                                : 'bg-emerald-400'
                        }`}
                      />

                      <div className="pl-2">
                        {/* Ticket title and status */}
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

                        {/* Priority badge */}
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
                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300'
                                    : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200'
                            }`}
                          >
                            {ticket.priority || 'LOW'}
                          </span>
                        </div>

                        {/* Ticket description */}
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

            <div className="grid grid-cols-2 gap-3 lg:flex lg:min-h-0 lg:flex-col">
              <button
                type="button"
                onClick={() => {
                  setFormError('');
                  setFormSuccess('');
                  setActiveSection('createTicket');
                }}
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
          </div>
        )}

        {activeSection === 'createTicket' && (
          <div className="min-h-0 flex-1 overflow-y-auto rounded-xl border border-stone/70 bg-white p-4 shadow-sm dark:border-[#55595D] dark:bg-[#34383C] sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-champagne">
                  Support
                </p>
                <h2 className="mt-1 text-xl font-semibold">
                  Create a Ticket
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setActiveSection('dashboard')}
                className="rounded-md border border-stone px-3 py-2 text-sm transition hover:bg-ivory dark:border-[#55595D] dark:hover:bg-[#25282B]"
              >
                Back to Dashboard
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label
                  htmlFor="ticket-title"
                  className="mb-1 block text-sm font-medium"
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
                  className="w-full rounded-lg border border-stone bg-transparent px-3 py-2 text-sm outline-none focus:border-champagne dark:border-[#55595D]"
                />
              </div>

              <div>
                <label
                  htmlFor="ticket-description"
                  className="mb-1 block text-sm font-medium"
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
                  className="w-full resize-y rounded-lg border border-stone bg-transparent px-3 py-2 text-sm outline-none focus:border-champagne dark:border-[#55595D]"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="ticket-category"
                    className="mb-1 block text-sm font-medium"
                  >
                    Category
                  </label>
                  <select
                    id="ticket-category"
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    className="w-full rounded-lg border border-stone bg-transparent px-3 py-2 text-sm outline-none focus:border-champagne dark:border-[#55595D]"
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
                    className="mb-1 block text-sm font-medium"
                  >
                    Priority
                  </label>
                  <select
                    id="ticket-priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleFormChange}
                    className="w-full rounded-lg border border-stone bg-transparent px-3 py-2 text-sm outline-none focus:border-champagne dark:border-[#55595D]"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>
              </div>

              {formError && (
                <p role="alert" className="text-sm text-red-600">
                  {formError}
                </p>
              )}

              {formSuccess && (
                <p role="status" className="text-sm text-green-600">
                  {formSuccess}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isCreating}
                  className="rounded-lg bg-charcoal px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-champagne dark:text-charcoal"
                >
                  {isCreating ? 'Creating...' : 'Submit Ticket'}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSection('dashboard')}
                  className="rounded-lg border border-stone px-5 py-2.5 text-sm font-medium transition hover:bg-ivory dark:border-[#55595D] dark:hover:bg-[#25282B]"
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
