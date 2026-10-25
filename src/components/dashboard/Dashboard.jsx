
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../../services/authService.js';
import { logout } from '../../features/auth/authSlice';
import { api } from '../../services/api.js';
import {
  useGetMyTicketsQuery,
  useGetAllTicketsQuery,
  useCreateTicketMutation,
} from '../../services/ticketService';
import AdminPanel from './AdminPanel';
import AdminUserDetails from './AdminUserDetails';
import { useGetProfilePhotoQuery } from '../../services/profileService';
import ProfilePage from './profile/ProfilePage';
import TicketList from './widgets/TicketList';
import QuickActionCard from './widgets/QuickActionCard';
import CreateTicketForm from './widgets/CreateTicketForm';
import StatCard from './widgets/StatCard';

const Dashboard = ({ darkMode, onToggleTheme }) => {
  const { username, email } = useSelector((state) => state.auth);
  const userId = useSelector((state) => state.auth.userId);
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.role);
  const token = useSelector((state) => state.auth.token);
  const [logoutRequest] = useLogoutMutation();



  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedAdminUser, setSelectedAdminUser] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(null);
  const { data: profilePhotoData } = useGetProfilePhotoQuery();



  useEffect(() => {
    setProfilePhotoUrl(
      typeof profilePhotoData === 'string' ? profilePhotoData : null
    );
  }, [profilePhotoData]);


  const isAdmin = role === 'ADMIN';
  const isITManager = role === 'IT_MANAGER';
  const isITSupport = role === 'IT_SUPPORT';

  const useAllTickets = isAdmin || isITManager || isITSupport;

  const myTicketsQuery = useGetMyTicketsQuery(undefined, {
    skip: useAllTickets,
  });

  const allTicketsQuery = useGetAllTicketsQuery(undefined, {
    skip: !useAllTickets,
  });

  const tickets = useAllTickets
    ? allTicketsQuery.data
    : myTicketsQuery.data;

  const isLoading = useAllTickets
    ? allTicketsQuery.isLoading
    : myTicketsQuery.isLoading;

  const isError = useAllTickets
    ? allTicketsQuery.isError
    : myTicketsQuery.isError;


  const [createTicket, { isLoading: isCreating }] =
    useCreateTicketMutation();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'SOFTWARE',
    priority: 'MEDIUM',
  });

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const allTickets = Array.isArray(tickets) ? tickets : [];

  const ticketStats = [
    {
      label: 'Total',
      value: allTickets.length,
      status: 'ALL',
      marker: '∑',
      accent: 'bg-stone/20 text-charcoal dark:bg-[#55595D] dark:text-ivory',
    },
    {
      label: 'Open',
      value: allTickets.filter((ticket) => ticket.status === 'OPEN').length,
      status: 'OPEN',
      marker: '○',
      accent: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
    },
    {
      label: 'In Progress',
      value: allTickets.filter((ticket) => ticket.status === 'IN_PROGRESS').length,
      status: 'IN_PROGRESS',
      marker: '↻',
      accent: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
    },
    {
      label: 'Resolved',
      value: allTickets.filter((ticket) => ticket.status === 'RESOLVED').length,
      status: 'RESOLVED',
      marker: '✓',
      accent: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
    },
    {
      label: 'Closed',
      value: allTickets.filter((ticket) => ticket.status === 'CLOSED').length,
      status: 'CLOSED',
      marker: '×',
      accent: 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200',
    },
  ];

  const filteredTickets =
    selectedStatus === 'ALL'
      ? allTickets
      : allTickets.filter((ticket) => ticket.status === selectedStatus);

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
      console.error('Create ticket error:', error);

      setFormError(
        error?.data?.message ||
        error?.error ||
        (typeof error?.data === 'string' ? error.data : null) ||
        'Unable to create ticket. Please try again.'
      );
    }
  };

  const handleBackToDashboard = () => {
    setActiveSection('dashboard');
    setFormError('');
    setFormSuccess('');
  };



  const handleLogout = async () => {
    try {
      if (token) {
        await logoutRequest(token).unwrap();
      }
    } catch (error) {
      console.error('Backend logout failed:', error);
    } finally {
      dispatch(api.util.resetApiState());
      dispatch(logout());
    }
  };


  return (
    <main className="flex h-dvh flex-col overflow-hidden bg-ivory p-3 text-charcoal dark:bg-[#25282B] dark:text-ivory sm:p-5">
      <header className="mx-auto flex w-full max-w-6xl shrink-0 items-center justify-between gap-4 border-b border-stone/70 pb-4 dark:border-[#55595D] sm:pb-5">
        <div className="min-w-0 border-l-2 border-champagne pl-3 sm:pl-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-champagne sm:text-xs">
            Helpdesk Portal
          </p>

          <h1 className="mt-1.5 break-words text-lg font-semibold tracking-tight sm:text-2xl">
            Welcome back, {username || 'User'}!
          </h1>

          <p className="mt-1 text-xs text-charcoal/60 dark:text-ivory/60 sm:text-sm">
            Manage your support requests.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setActiveSection('profile')}
            aria-label="Open profile"
            className="group flex items-center gap-2 rounded-lg border border-stone/70 bg-white/70 p-1.5 pr-3 transition hover:border-champagne hover:bg-champagne/10 focus:outline-none focus:ring-2 focus:ring-champagne dark:border-[#55595D] dark:bg-[#34383C] sm:gap-2.5 sm:p-2 sm:pr-4"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-champagne/50 bg-champagne/10 text-champagne sm:h-9 sm:w-9">
              {profilePhotoUrl ? (
                <img
                  src={profilePhotoUrl}
                  alt="Profile"
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="8" r="3.5" />
                  <path
                    d="M5 20a7 7 0 0 1 14 0"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </div>

            <div className="hidden min-w-0 text-left sm:block">
              <p className="text-[10px] font-medium uppercase tracking-wider text-charcoal/50 dark:text-ivory/50">
                Account
              </p>
              <p className="max-w-24 truncate text-xs font-semibold text-charcoal dark:text-ivory">
                {username || 'My Profile'}
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-stone/70 bg-white/70 text-charcoal transition hover:border-champagne hover:bg-champagne/10 focus:outline-none focus:ring-2 focus:ring-champagne dark:border-[#55595D] dark:bg-[#34383C] dark:text-ivory"
          >
            {darkMode ? (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                className="h-[18px] w-[18px]"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-[18px] w-[18px]"
                aria-hidden="true"
              >
                <path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5 8.5 8.5 0 1 0 20.5 14.2Z" />
              </svg>
            )}
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-champagne/70 px-3 py-2 text-xs font-semibold transition hover:bg-champagne hover:text-white focus:outline-none focus:ring-2 focus:ring-champagne dark:hover:text-[#25282B] sm:px-4 sm:text-sm"
          >
            Sign Out
          </button>
        </div>
      </header>

      <section className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col pt-3 sm:pt-4">
        {activeSection === 'dashboard' && (
          <div className="flex min-h-0 flex-1 flex-col gap-2">
            <div className="grid shrink-0 grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
              {ticketStats.map((stat) => (
                <StatCard
                  key={stat.status}
                  label={stat.label}
                  value={isLoading || isError ? '—' : stat.value}
                  marker={stat.marker}
                  accent={stat.accent}
                  active={selectedStatus === stat.status}
                  onClick={() => setSelectedStatus(stat.status)}
                />
              ))}
            </div>

            <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)_auto] gap-3 lg:grid-cols-3 lg:grid-rows-1 lg:gap-4">
              <TicketList
                tickets={filteredTickets}
                isLoading={isLoading}
                isError={isError}
              />

              <QuickActionCard
                onCreateTicket={handleOpenCreateTicket}
              />
            </div>
          </div>
        )}

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

        {activeSection === 'profile' && (
          <ProfilePage
            username={username}
            email={email}
            onBack={handleBackToDashboard}
            onLogout={handleLogout}
            onAdminPanel={() => setActiveSection('admin')}
          />
        )}


        {activeSection === 'admin' && (
          <AdminPanel
            onBack={() => setActiveSection('profile')}
            onSelectUser={(user) => {
              setSelectedAdminUser(user);
              setActiveSection('admin-user');
            }}
          />
        )}
        {activeSection === 'admin-user' && (
          <AdminUserDetails
            user={selectedAdminUser}
            currentUserId={userId}
            onBack={() => setActiveSection('admin')}
          />
        )}
      </section>
    </main>
  );
};

export default Dashboard;
