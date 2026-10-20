
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import {useGetMyTicketsQuery,useCreateTicketMutation,} from '../../services/ticketService';

import TicketList from './widgets/TicketList';
import QuickActionCard from './widgets/QuickActionCard';
import CreateTicketForm from './widgets/CreateTicketForm';
import StatCard from './widgets/StatCard';

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

  const handleOpenCreateTicket = () => {
    setFormError('');
    setFormSuccess('');
    setActiveSection('createTicket');
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

      setActiveSection('dashboard');
    } catch (error) {
      setFormError(
        typeof error?.data === 'string'
          ? error.data
          : error?.data?.message ||
              'Unable to create ticket. Please try again.'
      );
    }
  };

  const handleBackToDashboard = () => {
    setActiveSection('dashboard');
    setFormError('');
    setFormSuccess('');
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
                <StatCard
                  key={stat.label}
                  label={stat.label}
                  value={isLoading || isError ? '—' : stat.value}
                  marker={stat.marker}
                  accent={stat.accent}
                />
              ))}
            </div>

            {/* Main dashboard content */}
            <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)_auto] gap-3 lg:grid-cols-3 lg:grid-rows-1 lg:gap-4">
              {/* My Tickets */}
              <TicketList
                tickets={tickets}
                isLoading={isLoading}
                isError={isError}
              />

              {/* Quick actions */}
              <QuickActionCard
                onCreateTicket={handleOpenCreateTicket}
              />
            </div>
          </div>
        )}

        {/* Create ticket section */}
        {activeSection === 'createTicket' && (
  <CreateTicketForm
    formData={formData}
    handleFormChange={handleFormChange}
    handleCreateTicket={handleCreateTicket}
    formError={formError}
    formSuccess={formSuccess}
    isCreating={isCreating}
    onBack={handleBackToDashboard}
  />
)}
      </section>
    </main>
  );
};

export default Dashboard;
