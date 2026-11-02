
import { useState } from 'react';
import { useGetAllUsersQuery } from '../../services/userService';
import { useGetUserProfilePhotoQuery } from '../../services/profileService';

const UserAvatar = ({ user }) => {
  const {
    data: photo,
    isError,
  } = useGetUserProfilePhotoQuery(user.id, {
    skip: !user.id,
  });

  const initials = (user.username || user.email || '?')
    .trim()
    .charAt(0)
    .toUpperCase();

  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-stone/80 bg-champagne/20 text-sm font-semibold text-charcoal dark:border-[#55595D] dark:text-ivory">
      {photo && !isError ? (
        <img
          src={photo}
          alt={`${user.username || 'User'} profile`}
          className="h-full w-full rounded-full object-cover"
        />
      ) : (
        initials
      )}
    </div>
  );
};

const AdminPanel = ({ onBack, onSelectUser }) => {
  const { data: users, isLoading, isError } = useGetAllUsersQuery();

  const [selectedRole, setSelectedRole] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const roleButtons = [
    { label: 'Employee', value: 'EMPLOYEE' },
    { label: 'IT Support', value: 'IT_SUPPORT' },
    { label: 'IT Manager', value: 'IT_MANAGER' },
  ];

  const filteredUsers = (Array.isArray(users) ? users : []).filter((user) => {
    const userRole = String(user.role || '').trim().toUpperCase();

    const matchesRole =
      selectedRole === 'ALL' || userRole === selectedRole;

    const search = searchTerm.trim().toLowerCase();

    const matchesSearch =
      !search ||
      String(user.username || '').toLowerCase().includes(search) ||
      String(user.email || '').toLowerCase().includes(search);

    return matchesRole && matchesSearch;
  });

  const navigationButtonStyle =
    'flex h-[48px] min-w-0 flex-1 cursor-pointer items-center justify-center rounded-lg border px-2 text-xs font-semibold text-center transition hover:border-champagne hover:bg-champagne/10 focus:outline-none focus:ring-2 focus:ring-champagne';

  const activeButtonStyle =
    'border-champagne bg-champagne/20 text-charcoal dark:text-ivory';

  const inactiveButtonStyle =
    'border-stone/80 bg-white text-charcoal/70 dark:border-[#55595D] dark:bg-[#34383C] dark:text-ivory/70';

  return (
    <div className="mx-auto flex h-full w-full max-w-6xl flex-col overflow-hidden">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-champagne">
            Administration
          </p>

          <h2 className="mt-1 text-2xl font-semibold">
            Admin Panel
          </h2>

          <p className="mt-1 text-sm text-charcoal/60 dark:text-ivory/60">
            Manage users and review account information.
          </p>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="shrink-0 rounded-full border border-stone p-3 text-sm transition hover:border-champagne hover:bg-champagne/10 dark:border-[#55595D]"
        >
          Back
        </button>
      </div>

      <div className="mb-4 rounded-xl border border-stone/80 bg-white px-6 py-2 dark:border-[#55595D] dark:bg-[#34383C]">
        <p className="text-sm text-charcoal/60 dark:text-ivory/60">
          Total users
        </p>

        <p className="mt-1 text-3xl font-semibold">
          {Array.isArray(users) ? users.length : '—'}
        </p>
      </div>

      <section className="users-scrollbar min-h-0 flex-1 overflow-auto rounded-xl border border-stone/80 bg-white dark:border-[#55595D] dark:bg-[#34383C]">
        <div className="border-b border-stone/80 px-5 py-4 dark:border-[#55595D]">
          <h3 className="font-semibold">All Users</h3>
        </div>

        {/* Role filters and search */}
        <div className="border-b border-stone/80 px-5 py-4 dark:border-[#55595D]">
          <div className="flex w-full items-center gap-2">
            {roleButtons.map((button) => {
              const isActive = selectedRole === button.value;

              return (
                <button
                  key={button.value}
                  type="button"
                  onClick={() =>
                    setSelectedRole(isActive ? 'ALL' : button.value)
                  }
                  aria-pressed={isActive}
                  className={`${navigationButtonStyle} ${
                    isActive ? activeButtonStyle : inactiveButtonStyle
                  }`}
                >
                  {button.label}
                </button>
              );
            })}

            {/* Search field styled like the role buttons */}
            <div className="flex h-[48px] min-w-0 flex-1 items-center gap-2 rounded-lg border border-stone/80 bg-white px-3 transition focus-within:border-champagne focus-within:ring-2 focus-within:ring-champagne dark:border-[#55595D] dark:bg-[#34383C]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0 text-charcoal/50 dark:text-ivory/50"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>

              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search users..."
                aria-label="Search users by name or email"
                className="h-full w-full min-w-0 bg-transparent text-xs text-charcoal outline-none placeholder:text-charcoal/40 dark:text-ivory dark:placeholder:text-ivory/40"
              />

              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  aria-label="Clear search"
                  className="shrink-0 text-charcoal/50 transition hover:text-charcoal dark:text-ivory/50 dark:hover:text-ivory"
                >
                  &times;
                </button>
              )}
            </div>
          </div>
        </div>

        {isLoading && (
          <p className="p-5 text-sm">
            Loading users...
          </p>
        )}

        {isError && (
          <p
            role="alert"
            className="p-5 text-sm text-red-600 dark:text-red-400"
          >
            Unable to load users. Please check your permissions and try again.
          </p>
        )}

        {!isLoading && !isError && filteredUsers.length === 0 && (
          <p className="p-5 text-sm text-charcoal/60 dark:text-ivory/60">
            No users found matching your selection.
          </p>
        )}

        {!isLoading && !isError && filteredUsers.length > 0 && (
          <div>
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="text-charcoal/70 dark:text-ivory/70">
                <tr>
                  <th className="sticky top-0 z-20 bg-ivory px-4 py-3 text-left font-medium dark:bg-[#25282B]">
                    User
                  </th>

                  <th className="sticky top-0 z-20 bg-ivory px-5 py-3 text-left font-medium dark:bg-[#25282B]">
                    Email
                  </th>

                  <th className="sticky top-0 z-20 bg-ivory px-5 py-3 text-left font-medium dark:bg-[#25282B]">
                    Role
                  </th>

                  <th className="sticky top-0 z-20 bg-ivory px-5 py-3 text-left font-medium dark:bg-[#25282B]">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    onClick={() => onSelectUser?.(user)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        onSelectUser?.(user);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`Edit ${user.username || user.email || 'user'}`}
                    className="cursor-pointer border-t border-stone/70 transition hover:bg-champagne/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-champagne dark:border-[#55595D]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <UserAvatar user={user} />

                        <span className="font-medium">
                          {user.username || '—'}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      {user.email || '—'}
                    </td>

                    <td className="px-5 py-4">
                      {user.role || '—'}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={
                          user.active
                            ? 'text-green-700 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }
                      >
                        {user.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminPanel;