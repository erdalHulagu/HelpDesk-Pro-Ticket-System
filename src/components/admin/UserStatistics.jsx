
const UserStatistics = ({
  users,
  isLoading,
  isError,
  selectedRole,
  setSelectedRole,
  searchTerm,
  setSearchTerm,
}) => {
  const allUsers = Array.isArray(users) ? users : [];

  const getRoleCount = (role) =>
    allUsers.filter(
      (user) =>
        String(user.role || '').trim().toUpperCase() === role
    ).length;

  const statistics = [
    {
      title: 'Total Users',
      value: allUsers.length,
      role: 'ALL',
    },
    {
      title: 'Employees',
      value: getRoleCount('EMPLOYEE'),
      role: 'EMPLOYEE',
    },
    {
      title: 'IT Support',
      value: getRoleCount('IT_SUPPORT'),
      role: 'IT_SUPPORT',
    },
    {
      title: 'IT Managers',
      value: getRoleCount('IT_MANAGER'),
      role: 'IT_MANAGER',
    },
  ];

  return (
    <div className="sticky top-0 z-30 mb-3 border-b border-stone/80 bg-ivory py-2 dark:border-[#55595D] dark:bg-[#25282B]">
      <div className="grid grid-cols-2 gap-2 xl:grid-cols-5">
        {statistics.map((stat) => {
          const isActive = selectedRole === stat.role;

          return (
            <button
              key={stat.role}
              type="button"
              onClick={() => setSelectedRole(stat.role)}
              aria-pressed={isActive}
              className={`flex min-h-[48px] items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left transition focus:outline-none focus:ring-2 focus:ring-champagne ${
                isActive
                  ? 'border-champagne bg-champagne/20 text-charcoal dark:text-ivory'
                  : 'border-stone/80 bg-white text-charcoal/70 hover:border-champagne hover:bg-champagne/10 dark:border-[#55595D] dark:bg-[#34383C] dark:text-ivory/70'
              }`}
            >
              <span className="text-xs font-semibold">
                {stat.title}
              </span>

              <span className="text-lg font-bold">
                {isLoading || isError ? '—' : stat.value}
              </span>
            </button>
          );
        })}

        <div className="col-span-2 flex h-12 items-center gap-2 rounded-lg border border-stone/80 bg-white px-3 transition focus-within:border-champagne focus-within:ring-2 focus-within:ring-champagne xl:col-span-1 dark:border-[#55595D] dark:bg-[#34383C]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
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
              className="text-lg text-charcoal/50 hover:text-charcoal dark:text-ivory/50 dark:hover:text-ivory"
            >
              &times;
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserStatistics;