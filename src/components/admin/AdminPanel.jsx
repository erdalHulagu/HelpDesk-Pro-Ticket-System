
import { useState } from 'react';

import { useGetAllUsersQuery } from '../../services/userService';

import AdminHeader from './AdminHeader';
import UserStatistics from './UserStatistics';
import UserStatusOverview from './UserStatusOverview';
import UserTable from './UserTable';

const AdminPanel = ({ onBack, onSelectUser }) => {
  const {
    data: users,
    isLoading,
    isError,
  } = useGetAllUsersQuery();

  const [selectedRole, setSelectedRole] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

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
    </div>
  );
};

export default AdminPanel;