
const UserStatusOverview = ({
  users,
  isLoading,
  isError,
  statusFilter,
  setStatusFilter,
}) => {
  const allUsers = Array.isArray(users) ? users : [];

  const isUserActive = (user) =>
  user.active === true ||
  user.active === 'true' ||
  user.isActive === true ||
  user.isActive === 'true';

  const activeCount = allUsers.filter(isUserActive).length;
  const inactiveCount = allUsers.filter(
    (user) => user.active === false || user.active === 'false'
  ).length;

  const activePercentage =
    allUsers.length > 0
      ? (activeCount / allUsers.length) * 100
      : 0;

  const inactivePercentage =
    allUsers.length > 0
      ? (inactiveCount / allUsers.length) * 100
      : 0;

  const isDisabled = isLoading || isError;

  const buttonClass = (selected, color) =>
    `flex items-center gap-2 rounded-md border px-3 py-2 transition ${
      selected
        ? color === 'green'
          ? 'border-green-500 bg-green-100 dark:bg-green-900/30'
          : color === 'red'
            ? 'border-red-500 bg-red-100 dark:bg-red-900/30'
            : 'border-blue-500 bg-blue-100 dark:bg-blue-900/30'
        : 'border-stone/70 bg-white hover:border-champagne dark:border-[#55595D] dark:bg-[#34383C]'
    } disabled:cursor-not-allowed disabled:opacity-50`;

  return (
    <div className="mb-3 rounded-lg border border-stone/80 bg-white px-4 py-3 dark:border-[#55595D] dark:bg-[#34383C]">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-xs font-semibold">
          Account Status
        </h3>

        <span className="text-[10px] text-charcoal/50 dark:text-ivory/50">
          Account overview
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setStatusFilter('ALL')}
          disabled={isDisabled}
          aria-pressed={statusFilter === 'ALL'}
          className={buttonClass(statusFilter === 'ALL', 'blue')}
        >
          <span className="text-xs font-semibold">
            All Users
          </span>
          <span className="text-sm font-bold">
            {isDisabled ? '—' : allUsers.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('ACTIVE')}
          disabled={isDisabled}
          aria-pressed={statusFilter === 'ACTIVE'}
          className={buttonClass(statusFilter === 'ACTIVE', 'green')}
        >
          <span className="h-2 w-2 rounded-full bg-green-500" />
          <span className="text-xs font-semibold">
            Active
          </span>
          <span className="text-sm font-bold text-green-700 dark:text-green-400">
            {isDisabled ? '—' : activeCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('INACTIVE')}
          disabled={isDisabled}
          aria-pressed={statusFilter === 'INACTIVE'}
          className={buttonClass(statusFilter === 'INACTIVE', 'red')}
        >
          <span className="h-2 w-2 rounded-full bg-red-500" />
          <span className="text-xs font-semibold">
            Inactive
          </span>
          <span className="text-sm font-bold text-red-600 dark:text-red-400">
            {isDisabled ? '—' : inactiveCount}
          </span>
        </button>
      </div>

      {!isDisabled && allUsers.length > 0 && (
        <div className="mt-3 flex h-1.5 overflow-hidden rounded-full bg-stone/30 dark:bg-[#25282B]">
          <div
            className="bg-green-500 transition-all"
            style={{ width: `${activePercentage}%` }}
          />
          <div
            className="bg-red-500 transition-all"
            style={{ width: `${inactivePercentage}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default UserStatusOverview;
