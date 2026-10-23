
import { useState, useEffect } from 'react';
import { useUpdateUserMutation } from '../../services/userService';

const ROLES = ['EMPLOYEE', 'IT_SUPPORT', 'IT_MANAGER', 'ADMIN'];

const AdminUserDetails = ({ user, currentUserId, onBack }) => {
  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [role, setRole] = useState(user?.role || 'EMPLOYEE');
  const [active, setActive] = useState(Boolean(user?.active));
  const [message, setMessage] = useState('');

  useEffect(() => {
    setUsername(user?.username || '');
    setEmail(user?.email || '');
    setRole(user?.role || 'EMPLOYEE');
    setActive(Boolean(user?.active));
    setMessage('');
  }, [user]);

  if (!user) {
    return (
      <div className="p-6">
        <p>No user selected.</p>
        <button type="button" onClick={onBack} className="mt-4 rounded-full border px-4 py-2">
          Back
        </button>
      </div>
    );
  }

  const isEditingOwnRole = String(user.id) === String(currentUserId);

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
        active,
      }).unwrap();

      setMessage('User updated successfully.');
    } catch (error) {
      setMessage(
        error?.data?.error || 'Unable to update user. Please try again.'
      );
    }
  };

  return (
    <div className="mx-auto h-full w-full max-w-3xl overflow-auto p-4 sm:p-6">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-champagne">
            Administration
          </p>
          <h2 className="mt-1 text-2xl font-semibold">User Details</h2>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="rounded-full border border-stone px-4 py-2 text-sm dark:border-[#55595D]"
        >
          Back to Users
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-xl border border-stone/80 bg-white p-5 dark:border-[#55595D] dark:bg-[#34383C] sm:p-6"
      >
        <div>
          <label htmlFor="admin-username" className="mb-1 block text-sm font-medium">
            Username
          </label>
          <input
            id="admin-username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
            className="w-full rounded-lg border border-stone bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-champagne dark:border-[#55595D]"
          />
        </div>

        <div>
          <label htmlFor="admin-email" className="mb-1 block text-sm font-medium">
            Email
          </label>
          <input
            id="admin-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="w-full rounded-lg border border-stone bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-champagne dark:border-[#55595D]"
          />
        </div>

        <div>
          <label htmlFor="admin-role" className="mb-1 block text-sm font-medium">
            Role
          </label>
          <select
            id="admin-role"
            value={role}
            onChange={(event) => setRole(event.target.value)}
            disabled={isEditingOwnRole}
            className="w-full rounded-lg border border-stone bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-champagne disabled:opacity-60 dark:border-[#55595D]"
          >
            {ROLES.map((item) => (
              <option key={item} value={item}>
                {item.replace('_', ' ')}
              </option>
            ))}
          </select>
          {isEditingOwnRole && (
            <p className="mt-1 text-xs text-charcoal/60 dark:text-ivory/60">
              You cannot change your own role.
            </p>
          )}
        </div>

        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={active}
            onChange={(event) => setActive(event.target.checked)}
          />
          Account active
        </label>

        {message && (
          <p role="status" className="text-sm">
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="rounded-full bg-charcoal px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50 dark:bg-champagne dark:text-charcoal"
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default AdminUserDetails;
