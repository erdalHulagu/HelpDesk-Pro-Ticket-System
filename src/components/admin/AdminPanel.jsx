
import { useState } from 'react';
import { useSelector } from 'react-redux';

import {
  useGetAllUsersQuery,
  exportUsersExcel,
} from '../../services/userService';

import {
  useGetAdminTicketsQuery,
  exportTicketsExcel,
} from '../../services/ticketService';

import AdminHeader from './AdminHeader';
import UserStatistics from './UserStatistics';
import UserStatusOverview from './UserStatusOverview';
import UserTable from './UserTable';
import AnnouncementManagement from './AnnouncementManagement';
import SecurityLogPanel from './SecurityLogPanel';
import TicketList from '../dashboard/widgets/TicketList';

const AdminPanel = ({ onBack, onSelectUser }) => {
  const token = useSelector((state) => state.auth?.token);

  //* Users query
  const {
    data: users,
    isLoading,
    isError,
    refetch: refetchUsers,
  } = useGetAllUsersQuery();

  //* Tickets query
  const {
    data: tickets,
    isLoading: isLoadingTickets,
    isError: isTicketsError,
    refetch: refetchTickets,
  } = useGetAdminTicketsQuery(undefined, {
    skip: !token,
  });

  const [activeSection, setActiveSection] = useState('USERS');

  //* User filters
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  //* Ticket filters
  const [selectedTicketStatus, setSelectedTicketStatus] = useState('ALL');
  const [ticketSearchTerm, setTicketSearchTerm] = useState('');

  //* Users export
  const [usersStartDate, setUsersStartDate] = useState('');
  const [usersEndDate, setUsersEndDate] = useState('');
  const [isExportingUsers, setIsExportingUsers] = useState(false);
  const [usersExportError, setUsersExportError] = useState('');

  //* Tickets export
  const [ticketsStartDate, setTicketsStartDate] = useState('');
  const [ticketsEndDate, setTicketsEndDate] = useState('');
  const [isExportingTickets, setIsExportingTickets] = useState(false);
  const [ticketsExportError, setTicketsExportError] = useState('');

  const allUsers = Array.isArray(users) ? users : [];
  const allTickets = Array.isArray(tickets) ? tickets : [];

  //* User filtering
  const getUserActiveStatus = (user) => {
    const value = user.isActive ?? user.active ?? user.is_active;

    if (value === true || value === 'true' || value === 1 || value === '1') {
      return true;
    }

    if (value === false || value === 'false' || value === 0 || value === '0') {
      return false;
    }

    return null;
  };

  // User filtering
  const filteredUsers = allUsers.filter((user) => {
    const userRole = String(user.role || '').trim().toUpperCase();
    const search = searchTerm.trim().toLowerCase();

    const activeStatus = getUserActiveStatus(user);

    const matchesRole =
      selectedRole === 'ALL' || userRole === selectedRole;

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE' && activeStatus === true) ||
      (statusFilter === 'INACTIVE' && activeStatus === false);

    const matchesSearch =
      !search ||
      String(user.username || '').toLowerCase().includes(search) ||
      String(user.email || '').toLowerCase().includes(search);

    return matchesRole && matchesStatus && matchesSearch;
  });


  //* Ticket counts
  const ticketStatuses = [
    { value: 'ALL', label: 'All Tickets' },
    { value: 'OPEN', label: 'Open' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'RESOLVED', label: 'Resolved' },
    { value: 'CLOSED', label: 'Closed' },
  ];

  const getTicketCount = (status) => {
    if (status === 'ALL') return allTickets.length;

    return allTickets.filter(
      (ticket) =>
        String(ticket.status || '').toUpperCase() === status
    ).length;
  };

  //* Ticket filtering
  const filteredTickets = allTickets.filter((ticket) => {
    const status = String(ticket.status || '').toUpperCase();
    const search = ticketSearchTerm.trim().toLowerCase();

    const matchesStatus =
      selectedTicketStatus === 'ALL' ||
      status === selectedTicketStatus;

    const searchableValues = [
      ticket.id,
      ticket.title,
      ticket.description,
      ticket.category,
      ticket.priority,
      ticket.status,
      ticket.createdByUsername,
      ticket.createdByRole,
    ];

    const matchesSearch =
      !search ||
      searchableValues.some((value) =>
        String(value || '').toLowerCase().includes(search)
      );

    return matchesStatus && matchesSearch;
  });

  const tabClass = (section) =>
    `border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${activeSection === section
      ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
      : 'border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white'
    }`;

  //* Download helper
  const downloadExcel = (blob, filename) => {
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = downloadUrl;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(downloadUrl);
  };

  //* Export users
  const handleExportUsers = async () => {
    setUsersExportError('');

    if (usersStartDate && usersEndDate && usersStartDate > usersEndDate) {
      setUsersExportError('Start date cannot be after end date.');
      return;
    }

    if (!token) {
      setUsersExportError('Authentication token not found.');
      return;
    }

    try {
      setIsExportingUsers(true);

      const blob = await exportUsersExcel({
        token,
        startDate: usersStartDate,
        endDate: usersEndDate,
      });

      downloadExcel(blob, 'users.xlsx');
    } catch (error) {
      setUsersExportError(error.message || 'Failed to export users.');
    } finally {
      setIsExportingUsers(false);
    }
  };

  //* Export tickets
  const handleExportTickets = async () => {
    setTicketsExportError('');

    if (
      ticketsStartDate &&
      ticketsEndDate &&
      ticketsStartDate > ticketsEndDate
    ) {
      setTicketsExportError('Start date cannot be after end date.');
      return;
    }

    if (!token) {
      setTicketsExportError('Authentication token not found.');
      return;
    }

    try {
      setIsExportingTickets(true);

      const blob = await exportTicketsExcel({
        token,
        startDate: ticketsStartDate,
        endDate: ticketsEndDate,
      });

      downloadExcel(blob, 'tickets.xlsx');
    } catch (error) {
      setTicketsExportError(error.message || 'Failed to export tickets.');
    } finally {
      setIsExportingTickets(false);
    }
  };

  //* Shared compact styles
  const dateInputClass =
    'h-8 rounded-md border border-stone/80 bg-white px-2 text-xs text-charcoal outline-none focus:border-champagne focus:ring-1 focus:ring-champagne/30 dark:border-[#55595D] dark:bg-[#34383C] dark:text-ivory';

  const actionButtonClass =
    'h-8 rounded-md border border-stone/80 px-3 text-xs font-semibold text-charcoal transition hover:border-champagne hover:bg-champagne/10 disabled:opacity-50 dark:border-[#55595D] dark:text-ivory';

  const exportButtonClass =
    'h-8 rounded-md bg-green-600 px-3 text-xs font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50';

  const filterCardClass =
    'flex min-h-[42px] items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left transition focus:outline-none focus:ring-2 focus:ring-champagne';

  const searchInputClass =
    'h-9 min-w-0 flex-1 rounded-lg border border-stone/80 bg-white px-3 text-xs text-charcoal outline-none focus:border-champagne focus:ring-1 focus:ring-champagne/30 dark:border-[#55595D] dark:bg-[#34383C] dark:text-ivory';

  return (
    <div className="mx-auto flex h-full w-full max-w-6xl flex-col overflow-hidden">
      <AdminHeader onBack={onBack} />

      {/* Admin tabs */}
      <div className="mb-3 flex shrink-0 gap-2 overflow-x-auto border-b border-stone/80 dark:border-[#55595D]">
        <button
          type="button"
          onClick={() => setActiveSection('USERS')}
          className={tabClass('USERS')}
        >
          User Management
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('SECURITY_LOGS')}
          className={tabClass('SECURITY_LOGS')}
        >
          Security Logs
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('TICKETS')}
          className={tabClass('TICKETS')}
        >
          Tickets
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('ANNOUNCEMENTS')}
          className={tabClass('ANNOUNCEMENTS')}
        >
          Announcement Center
        </button>
      </div>

      {/* USERS */}
      {activeSection === 'USERS' && (
        <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-stone/80 bg-white p-2 dark:border-[#55595D] dark:bg-[#34383C]">

          {/* Compact toolbar */}
          <div className="mb-2 flex shrink-0 flex-wrap items-end justify-between gap-2 border-b border-stone/70 pb-2 dark:border-[#55595D]">
            <div className="flex flex-wrap items-end gap-2">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold text-charcoal/70 dark:text-ivory/70">
                  Start Date
                </label>
                <input
                  type="date"
                  value={usersStartDate}
                  max={usersEndDate || undefined}
                  onChange={(e) => setUsersStartDate(e.target.value)}
                  className={dateInputClass}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold text-charcoal/70 dark:text-ivory/70">
                  End Date
                </label>
                <input
                  type="date"
                  value={usersEndDate}
                  min={usersStartDate || undefined}
                  onChange={(e) => setUsersEndDate(e.target.value)}
                  className={dateInputClass}
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  setUsersStartDate('');
                  setUsersEndDate('');
                  setUsersExportError('');
                }}
                className={actionButtonClass}
              >
                Clear Filters
              </button>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => refetchUsers()}
                className={actionButtonClass}
              >
                Refresh
              </button>

              <button
                type="button"
                onClick={handleExportUsers}
                disabled={isExportingUsers}
                className={exportButtonClass}
              >
                {isExportingUsers ? 'Exporting...' : 'Export Excel'}
              </button>
            </div>
          </div>

          {usersExportError && (
            <p className="mb-1 shrink-0 text-xs text-red-600 dark:text-red-400">
              {usersExportError}
            </p>
          )}

          {/* User role filters and search */}
          <div className="shrink-0">
            <UserStatistics
              users={users}
              isLoading={isLoading}
              isError={isError}
              selectedRole={selectedRole}
              setSelectedRole={setSelectedRole}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </div>

          {/* User status filters */}
          <div className="shrink-0">

            <UserStatusOverview
              users={users}
              isLoading={isLoading}
              isError={isError}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
            />

          </div>

          {/* Scrollable user list */}
          <div className="users-scrollbar mt-2 min-h-0 flex-1 overflow-auto rounded-lg border border-stone/70 dark:border-[#55595D]">
            

            <UserTable
              users={filteredUsers}
              isLoading={isLoading}
              isError={isError}
              onSelectUser={onSelectUser}
            />
          </div>
        </section>
      )}

      {/* SECURITY LOGS */}
      {activeSection === 'SECURITY_LOGS' && (
        <div className="flex min-h-0 flex-1 overflow-hidden">
          <SecurityLogPanel />
        </div>
      )}

      {/* TICKETS */}
      {activeSection === 'TICKETS' && (
        <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-stone/80 bg-white p-2 dark:border-[#55595D] dark:bg-[#34383C]">

          {/* Compact toolbar */}
          <div className="mb-2 flex shrink-0 flex-wrap items-end justify-between gap-2 border-b border-stone/70 pb-2 dark:border-[#55595D]">
            <div className="flex flex-wrap items-end gap-2">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold text-charcoal/70 dark:text-ivory/70">
                  Start Date
                </label>
                <input
                  type="date"
                  value={ticketsStartDate}
                  max={ticketsEndDate || undefined}
                  onChange={(e) => setTicketsStartDate(e.target.value)}
                  className={dateInputClass}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold text-charcoal/70 dark:text-ivory/70">
                  End Date
                </label>
                <input
                  type="date"
                  value={ticketsEndDate}
                  min={ticketsStartDate || undefined}
                  onChange={(e) => setTicketsEndDate(e.target.value)}
                  className={dateInputClass}
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  setTicketsStartDate('');
                  setTicketsEndDate('');
                  setTicketsExportError('');
                  setTicketSearchTerm('');
                  setSelectedTicketStatus('ALL');
                }}
                className={actionButtonClass}
              >
                Clear Filters
              </button>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => refetchTickets()}
                className={actionButtonClass}
              >
                Refresh
              </button>

              <button
                type="button"
                onClick={handleExportTickets}
                disabled={isExportingTickets}
                className={exportButtonClass}
              >
                {isExportingTickets ? 'Exporting...' : 'Export Excel'}
              </button>
            </div>
          </div>

          {ticketsExportError && (
            <p className="mb-1 shrink-0 text-xs text-red-600 dark:text-red-400">
              {ticketsExportError}
            </p>
          )}

          {/* Ticket status filters and search */}
          <div className="mb-2 grid shrink-0 grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
            {ticketStatuses.map((item) => {
              const isActive = selectedTicketStatus === item.value;

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setSelectedTicketStatus(item.value)}
                  className={`${filterCardClass} ${isActive
                    ? 'border-champagne bg-champagne/20 text-charcoal dark:text-ivory'
                    : 'border-stone/80 bg-white text-charcoal/70 hover:border-champagne hover:bg-champagne/10 dark:border-[#55595D] dark:bg-[#34383C] dark:text-ivory/70'
                    }`}
                >
                  <span className="text-[10px] font-semibold">
                    {item.label}
                  </span>

                  <span className="text-base font-bold tabular-nums">
                    {getTicketCount(item.value)}
                  </span>
                </button>
              );
            })}

            <input
              type="search"
              value={ticketSearchTerm}
              onChange={(e) => setTicketSearchTerm(e.target.value)}
              placeholder="Search tickets..."
              aria-label="Search tickets"
              className={searchInputClass}
            />
          </div>

          {/* Ticket workspace */}
          <div className="ticket-scrollbar min-h-0 flex-1 overflow-hidden">
            <TicketList
              tickets={filteredTickets}
              isLoading={isLoadingTickets}
              isError={isTicketsError}
            />
          </div>
        </section>
      )}

      {/* ANNOUNCEMENTS */}
      {activeSection === 'ANNOUNCEMENTS' && (
        <div className="min-h-0 flex-1 overflow-auto">
          <AnnouncementManagement />
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
