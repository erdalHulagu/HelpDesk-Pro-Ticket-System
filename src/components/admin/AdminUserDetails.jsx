import { useState, useEffect } from 'react';
import { useUpdateUserMutation } from '../../services/userService';

const ROLES = ['EMPLOYEE', 'IT_SUPPORT', 'IT_MANAGER', 'ADMIN'];

const AdminUserDetails = ({ user, currentUserId, onBack }) => {
  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [role, setRole] = useState(user?.role || 'EMPLOYEE');
  const [active, setActive] = useState(user?.isActive ?? user?.active ?? true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setUsername(user?.username || '');
    setEmail(user?.email || '');
    setRole(user?.role || 'EMPLOYEE');
    setActive(user?.isActive ?? user?.active ?? true);
    setMessage('');
  }, [user]);

  if (!user) {
    return (
      <div className="p-6">
        <p>No user selected.</p>
        <button
          type="button"
          onClick={onBack}
          className="mt-4 rounded-full border px-4 py-2"
        >
          Back
        </button>
      </div>
    );
  }

  const isEditingOwnRole =
    String(user.id) === String(currentUserId);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    if (isEditingOwnRole && role !== user.role) {
      setMessage('You cannot change your own role.');
      return;
    }

    try {
      await updateUser({
        id: user.id,
        username: username.trim(),
        email: email.trim(),
        role,
        isActive: active,
      }).unwrap();

      setMessage('User updated successfully.');
    } catch (error) {
      setMessage(
        error?.data?.error || 'Unable to update user. Please try again.'
      );
    }
  };

  return (
    <div className="mx-auto h-full w-full max-w-5xl overflow-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-champagne">
            Administration
          </p>

          <h2 className="mt-1 text-2xl font-semibold">
            User Details
          </h2>

          <p className="mt-1 text-sm text-charcoal/60 dark:text-ivory/60">
            Manage user information, permissions and account status.
          </p>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="shrink-0 rounded-full border border-stone px-4 py-2 text-sm transition hover:border-champagne hover:bg-champagne/10 dark:border-[#55595D]"
        >
          Back to Users
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-stone/80 bg-white p-5 dark:border-[#55595D] dark:bg-[#34383C] sm:p-8"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="admin-username"
              className="mb-2 block text-sm font-medium"
            >
              Username
            </label>

            <input
              id="admin-username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
              className="w-full rounded-lg border border-stone bg-transparent px-4 py-3 outline-none transition focus:border-champagne focus:ring-2 focus:ring-champagne dark:border-[#55595D]"
            />
          </div>

          <div>
            <label
              htmlFor="admin-email"
              className="mb-2 block text-sm font-medium"
            >
              Email
            </label>

            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full rounded-lg border border-stone bg-transparent px-4 py-3 outline-none transition focus:border-champagne focus:ring-2 focus:ring-champagne dark:border-[#55595D]"
            />
          </div>

          <div>
            <label
              htmlFor="admin-role"
              className="mb-2 block text-sm font-medium"
            >
              Role
            </label>

            <select
              id="admin-role"
              value={role}
              onChange={(event) => setRole(event.target.value)}
              disabled={isEditingOwnRole}
              className="w-full rounded-lg border border-stone bg-transparent px-4 py-3 outline-none transition focus:border-champagne focus:ring-2 focus:ring-champagne disabled:opacity-60 dark:border-[#55595D]"
            >
              {ROLES.map((item) => (
                <option key={item} value={item}>
                  {item.replace('_', ' ')}
                </option>
              ))}
            </select>

            {isEditingOwnRole && (
              <p className="mt-2 text-xs text-charcoal/60 dark:text-ivory/60">
                You cannot change your own role.
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Account Status
            </label>

            <div className="flex gap-3">
              <button
                type="button"
                aria-pressed={active === true}
                onClick={() => setActive(true)}
                className={`flex-1 rounded-lg border px-4 py-3 text-sm font-semibold transition ${
                  active === true
                    ? 'border-green-600 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'border-stone/80 text-charcoal/70 hover:border-green-600 dark:border-[#55595D] dark:text-ivory/70'
                }`}
              >
                Active
              </button>

              <button
                type="button"
                aria-pressed={active === false}
                onClick={() => setActive(false)}
                className={`flex-1 rounded-lg border px-4 py-3 text-sm font-semibold transition ${
                  active === false
                    ? 'border-red-600 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    : 'border-stone/80 text-charcoal/70 hover:border-red-600 dark:border-[#55595D] dark:text-ivory/70'
                }`}
              >
                Inactive
              </button>
            </div>

            <p className="mt-2 text-xs text-charcoal/60 dark:text-ivory/60">
              {active
                ? 'This account is enabled and can log in.'
                : 'This account is disabled and cannot log in.'}
            </p>
          </div>
        </div>

        {message && (
          <p
            role="status"
            className={`mt-6 text-sm ${
              message.includes('successfully')
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }`}
          >
            {message}
          </p>
        )}

        <div className="mt-8 flex justify-end border-t border-stone/70 pt-6 dark:border-[#55595D]">
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-full bg-charcoal px-8 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50 dark:bg-champagne dark:text-charcoal"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminUserDetails;
