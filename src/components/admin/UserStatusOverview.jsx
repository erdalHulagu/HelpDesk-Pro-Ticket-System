
const UserStatusOverview = ({ users, isLoading, isError }) => {
  const allUsers = Array.isArray(users) ? users : [];

  const activeCount = allUsers.filter(
    (user) => user.active === true
  ).length;

  const inactiveCount = allUsers.filter(
    (user) => user.active === false
  ).length;

  const activePercentage =
    allUsers.length > 0
      ? (activeCount / allUsers.length) * 100
      : 0;

  const inactivePercentage =
    allUsers.length > 0
      ? (inactiveCount / allUsers.length) * 100
      : 0;

  return (
    <div className="mb-3 rounded-lg border border-stone/80 bg-white px-4 py-3 dark:border-[#55595D] dark:bg-[#34383C]">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h3 className="text-xs font-semibold">
          User Status
        </h3>

        <span className="text-[10px] text-charcoal/50 dark:text-ivory/50">
          Account overview
        </span>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          <span className="text-xs text-charcoal/70 dark:text-ivory/70">
            Active
          </span>
          <span className="text-sm font-semibold text-green-700 dark:text-green-400">
            {isLoading || isError ? '—' : activeCount}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-red-500" />
          <span className="text-xs text-charcoal/70 dark:text-ivory/70">
            Inactive
          </span>
          <span className="text-sm font-semibold text-red-600 dark:text-red-400">
            {isLoading || isError ? '—' : inactiveCount}
          </span>
        </div>
      </div>

      {!isLoading && !isError && allUsers.length > 0 && (
        <div className="mt-2 flex h-1.5 overflow-hidden rounded-full bg-stone/30 dark:bg-[#25282B]">
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