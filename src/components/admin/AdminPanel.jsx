
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

  // Users
  const {
    data: users,
    isLoading,
    isError,
  } = useGetAllUsersQuery();

  // Admin tickets
  const {
    data: tickets,
    isLoading: isLoadingTickets,
    isError: isTicketsError,
  } = useGetAdminTicketsQuery(undefined, {
    skip: !token,
  });

  const [selectedRole, setSelectedRole] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSection, setActiveSection] = useState('USERS');

  // Users Excel
  const [usersStartDate, setUsersStartDate] = useState('');
  const [usersEndDate, setUsersEndDate] = useState('');
  const [isExportingUsers, setIsExportingUsers] = useState(false);
  const [usersExportError, setUsersExportError] = useState('');

  // Tickets Excel
  const [ticketsStartDate, setTicketsStartDate] = useState('');
  const [ticketsEndDate, setTicketsEndDate] = useState('');
  const [isExportingTickets, setIsExportingTickets] = useState(false);
  const [ticketsExportError, setTicketsExportError] = useState('');

  const allUsers = Array.isArray(users) ? users : [];
  const allTickets = Array.isArray(tickets) ? tickets : [];

  const filteredUsers = allUsers.filter((user) => {
    const userRole = String(user.role || '')
      .trim()
      .toUpperCase();

    const matchesRole =
      selectedRole === 'ALL' || userRole === selectedRole;

    const search = searchTerm.trim().toLowerCase();

    const matchesSearch =
      !search ||
      String(user.username || '').toLowerCase().includes(search) ||
      String(user.email || '').toLowerCase().includes(search);

    return matchesRole && matchesSearch;
  });

  const tabClass = (section) =>
    `border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
      activeSection === section
        ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
        : 'border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white'
    }`;

  // Download helper
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

  // Export Users
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
      setUsersExportError(
        error.message || 'Failed to export users.'
      );
    } finally {
      setIsExportingUsers(false);
    }
  };

  // Export Tickets
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
      setTicketsExportError(
        error.message || 'Failed to export tickets.'
      );
    } finally {
      setIsExportingTickets(false);
    }
  };

  return (
    <div className="mx-auto flex h-full w-full max-w-6xl flex-col overflow-hidden">

      <AdminHeader onBack={onBack} />

      {/* Admin sections */}
      <div className="mb-4 flex shrink-0 gap-2 overflow-x-auto border-b border-stone/80 dark:border-[#55595D]">

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

      {/* User Management */}
      {activeSection === 'USERS' && (
        <>
          <div className="mb-6 flex flex-wrap items-end gap-4">

            <div>
              <label className="mb-1 block text-sm font-medium">
                Start Date
              </label>
              <input
                type="date"
                value={usersStartDate}
                max={usersEndDate || undefined}
                onChange={(e) => setUsersStartDate(e.target.value)}
                className="rounded-lg border px-3 py-2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                End Date
              </label>
              <input
                type="date"
                value={usersEndDate}
                min={usersStartDate || undefined}
                onChange={(e) => setUsersEndDate(e.target.value)}
                className="rounded-lg border px-3 py-2"
              />
            </div>

            <button
              type="button"
              onClick={handleExportUsers}
              disabled={isExportingUsers}
              className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
            >
              {isExportingUsers ? 'Exporting...' : 'Export Excel'}
            </button>

          </div>

          {usersExportError && (
            <p className="mb-4 text-sm text-red-600">
              {usersExportError}
            </p>
          )}

          <UserStatistics
            users={users}
            isLoading={isLoading}
            isError={isError}
            selectedRole={selectedRole}
            setSelectedRole={setSelectedRole}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />

          <UserStatusOverview
            users={users}
            isLoading={isLoading}
            isError={isError}
          />

          <section className="users-scrollbar min-h-0 flex-1 overflow-auto rounded-xl border border-stone/80 bg-white dark:border-[#55595D] dark:bg-[#34383C]">

            <div className="border-b border-stone/80 px-5 py-3 dark:border-[#55595D]">
              <h3 className="text-sm font-semibold">
                All Users
              </h3>
            </div>

            <UserTable
              users={filteredUsers}
              isLoading={isLoading}
              isError={isError}
              onSelectUser={onSelectUser}
            />

          </section>
        </>
      )}

      {/* Announcement Center */}
      {activeSection === 'ANNOUNCEMENTS' && (
        <div className="min-h-0 flex-1 overflow-auto">
          <AnnouncementManagement />
        </div>
      )}

      {/* Security Logs */}
      {activeSection === 'SECURITY_LOGS' && (
         <div className="flex min-h-0 flex-1 overflow-hidden">
          <SecurityLogPanel />
        </div>
      )}

      {/* Tickets */}
      {activeSection === 'TICKETS' && (
         <div className="flex min-h-0 ticket-scrollbar flex-1 flex-col gap-4 overflow-y-auto overflow-x-hidden">

          <div className="flex  shrink-0 flex-wrap items-end gap-4">

            <div>
              <label className="mb-1 block text-sm font-medium text-charcoal dark:text-ivory">
                Start Date
              </label>
              <input
                type="date"
                value={ticketsStartDate}
                max={ticketsEndDate || undefined}
                onChange={(e) => setTicketsStartDate(e.target.value)}
                className="rounded-lg border border-stone/70 bg-white px-3 py-2 text-sm dark:border-[#55595D] dark:bg-[#34383C] dark:text-ivory"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-charcoal dark:text-ivory">
                End Date
              </label>
              <input
                type="date"
                value={ticketsEndDate}
                min={ticketsStartDate || undefined}
                onChange={(e) => setTicketsEndDate(e.target.value)}
                className="rounded-lg border border-stone/70 bg-white px-3 py-2 text-sm dark:border-[#55595D] dark:bg-[#34383C] dark:text-ivory"
              />
            </div>

            <button
              type="button"
              onClick={handleExportTickets}
              disabled={isExportingTickets}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isExportingTickets ? 'Exporting...' : 'Export Excel'}
            </button>

          </div>

          {ticketsExportError && (
            <p className="shrink-0 text-sm text-red-600">
              {ticketsExportError}
            </p>
          )}

          <div className="flex min-h-0 flex-1 overflow-hidden">
            <TicketList
              tickets={allTickets}
              isLoading={isLoadingTickets}
              isError={isTicketsError}
            />
          </div>

        </div>
      )}

    </div>
  );
};

export default AdminPanel;
