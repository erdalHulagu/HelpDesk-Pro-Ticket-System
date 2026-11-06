
import UserAvatar from './UserAvatar';

const UserTable = ({
  users,
  isLoading,
  isError,
  onSelectUser,
}) => {

  const getUserActiveStatus = (user) => {
    const value = user.isActive ?? user.active ?? user.is_active;

    if (
      value === true ||
      value === 'true' ||
      value === 1 ||
      value === '1'
    ) {
      return true;
    }

    if (
      value === false ||
      value === 'false' ||
      value === 0 ||
      value === '0'
    ) {
      return false;
    }

    return null;
  };

  return (
    <>
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

      {!isLoading && !isError && users.length === 0 && (
        <p className="p-5 text-sm text-charcoal/60 dark:text-ivory/60">
          No users found matching your selection.
        </p>
      )}

      {!isLoading && !isError && users.length > 0 && (
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
              {users.map((user) => {
                const isActive = getUserActiveStatus(user);

                return (
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
                          isActive === true
                            ? 'text-green-700 dark:text-green-400'
                            : isActive === false
                              ? 'text-red-600 dark:text-red-400'
                              : 'text-charcoal/50 dark:text-ivory/50'
                        }
                      >
                        {isActive === true
                          ? 'Active'
                          : isActive === false
                            ? 'Inactive'
                            : 'Unknown'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default UserTable;
