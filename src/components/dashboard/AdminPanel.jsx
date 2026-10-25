
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

  return (
    <div className="mx-auto flex h-full w-full max-w-6xl flex-col overflow-hidden">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-champagne">
            Administration
          </p>
          <h2 className="mt-1 text-2xl font-semibold">Admin Panel</h2>
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

      <div className=" mb-4 rounded-xl border border-stone/80 bg-white px-6 py-1 dark:border-[#55595D] dark:bg-[#34383C]">
        <p className=" text-sm text-charcoal/60 dark:text-ivory/60">
          Total users
        </p>
        <p className="mt-1 text-3xl font-semibold">
          {Array.isArray(users) ? users.length : '—'}
        </p>
      </div>

      <section className="users-scrollbar min-h-0 flex-1 overflow-auto rounded-xl border border-stone/80 bg-white dark:border-[#55595D] dark:bg-[#34383C]">
        <div className=" border-b border-stone/80 px-5 py-4 dark:border-[#55595D]">
          <h3 className="font-semibold">All Users</h3>
        </div>

        {isLoading && (
          <p className="p-5 text-sm">Loading users...</p>
        )}

        {isError && (
          <p role="alert" className="p-5 text-sm text-red-600 dark:text-red-400">
            Unable to load users. Please check your permissions and try again.
          </p>
        )}

        {!isLoading && !isError && Array.isArray(users) && users.length === 0 && (
          <p className="p-5 text-sm text-charcoal/60 dark:text-ivory/60">
            No users found.
          </p>
        )}

        {!isLoading && !isError && Array.isArray(users) && users.length > 0 && (
          <div className="">
            <table className=" w-full min-w-[520px] text-left text-sm">

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
                {users.map((user) => (
                  <tr
                    key={user.id}
                    onClick={() => onSelectUser?.(user)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
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
