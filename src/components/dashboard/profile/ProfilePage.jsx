
const ProfilePage = ({
  username,
  email,
  onBack,
  onLogout,
}) => {
  return (
    <section className="ticket-scrollbar min-h-0 flex-1 overflow-y-auto rounded-xl border border-stone/70 bg-white p-4 shadow-sm dark:border-[#55595D] dark:bg-[#34383C] sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-champagne">
            Account
          </p>

          <h2 className="mt-1 text-xl font-semibold">
            My Profile
          </h2>

          <p className="mt-1 text-sm text-charcoal/60 dark:text-ivory/60">
            View your account information.
          </p>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="shrink-0 rounded-full border border-stone px-3 py-2 text-xs font-medium transition hover:border-champagne hover:bg-champagne/10 dark:border-[#55595D] sm:text-sm"
        >
          Back
        </button>
      </div>

      <div className="mx-auto mt-8 max-w-xl">
        <div className="flex flex-col items-center rounded-2xl border border-stone/60 bg-ivory/60 p-6 dark:border-[#55595D] dark:bg-[#2B2E31] sm:p-8">
          {/* Profile photo placeholder */}
          <div className="relative">
            <div
              className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-2 border-champagne bg-champagne/10 text-4xl text-champagne sm:h-32 sm:w-32"
              aria-label="Profile photo placeholder"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
                className="h-16 w-16"
                aria-hidden="true"
              >
                <circle cx="12" cy="8" r="4" />
                <path
                  d="M4.5 21a7.5 7.5 0 0 1 15 0"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-white bg-emerald-500 dark:border-[#2B2E31]" />
          </div>

          <h3 className="mt-4 break-words text-xl font-semibold">
            {username || 'User'}
          </h3>

          <p className="mt-1 text-sm text-charcoal/60 dark:text-ivory/60">
            Helpdesk User
          </p>

          <div className="mt-7 w-full space-y-4">
            <div className="rounded-xl border border-stone/60 bg-white p-4 dark:border-[#55595D] dark:bg-[#34383C]">
              <p className="text-xs font-medium uppercase tracking-wider text-charcoal/50 dark:text-ivory/50">
                Username
              </p>

              <p className="mt-1 break-words text-sm font-medium">
                {username || 'Not available'}
              </p>
            </div>

            <div className="rounded-xl border border-stone/60 bg-white p-4 dark:border-[#55595D] dark:bg-[#34383C]">
              <p className="text-xs font-medium uppercase tracking-wider text-charcoal/50 dark:text-ivory/50">
                Email Address
              </p>

              <p className="mt-1 break-all text-sm font-medium">
                {email || 'Not available'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="mt-6 w-full rounded-full border border-red-300 px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30"
          >
            Sign Out
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
