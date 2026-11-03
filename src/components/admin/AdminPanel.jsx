import { useState } from 'react';

import { useGetAllUsersQuery } from '../../services/userService';

import AdminHeader from './AdminHeader';
import UserStatistics from './UserStatistics';
import UserStatusOverview from './UserStatusOverview';
import UserTable from './UserTable';
import AnnouncementManagement from './AnnouncementManagement';

const AdminPanel = ({ onBack, onSelectUser }) => {
  const {
    data: users,
    isLoading,
    isError,
  } = useGetAllUsersQuery();

  const [selectedRole, setSelectedRole] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSection, setActiveSection] = useState('USERS');

  const allUsers = Array.isArray(users) ? users : [];

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

  return (
    <div className="mx-auto flex h-full w-full max-w-6xl flex-col overflow-hidden">

      <AdminHeader onBack={onBack} />

      {/* Admin sections */}
      <div className="mb-4 flex shrink-0 gap-2 border-b border-stone/80 dark:border-[#55595D]">

        <button
          type="button"
          onClick={() => setActiveSection('USERS')}
          className={`border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
            activeSection === 'USERS'
              ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white'
          }`}
        >
          User Management
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('ANNOUNCEMENTS')}
          className={`border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
            activeSection === 'ANNOUNCEMENTS'
              ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white'
          }`}
        >
          Announcement Center
        </button>

      </div>

      {activeSection === 'USERS' ? (
        <>
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
      ) : (
        <div className="min-h-0 flex-1 overflow-auto">
          <AnnouncementManagement />
        </div>
      )}

    </div>
  );
};

export default AdminPanel;