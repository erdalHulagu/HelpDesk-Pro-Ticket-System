
const ProfileCard = ({ username, onOpenProfile }) => {
  return (
    <section className="rounded-xl border border-stone/70 bg-white p-4 shadow-sm transition hover:border-champagne/70 dark:border-[#55595D] dark:bg-[#34383C] sm:p-5">
      <div className="flex items-center gap-3">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-champagne bg-champagne/10 text-champagne"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="h-6 w-6"
          >
            <circle cx="12" cy="8" r="4" />
            <path
              d="M4.5 21a7.5 7.5 0 0 1 15 0"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold">My Profile</h2>
          <p className="mt-1 truncate text-sm text-charcoal/60 dark:text-ivory/60">
            {username || 'User'}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onOpenProfile}
        className="mt-4 w-full rounded-lg border border-stone px-4 py-2.5 text-sm font-medium transition hover:border-champagne hover:bg-champagne/10 focus:outline-none focus:ring-2 focus:ring-champagne dark:border-[#55595D]"
      >
        View Profile
        <span className="ml-2" aria-hidden="true">→</span>
      </button>
    </section>
  );
};

export default ProfileCard;
