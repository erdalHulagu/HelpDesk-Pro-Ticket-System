
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';


const Dashboard = () => {
 
  const { username } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <div className="min-h-[70vh] p-6 sm:p-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-champagne">
              Helpdesk Portal
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Welcome back, {username}!
            </h1>

            <p className="mt-3 text-charcoal/65 dark:text-ivory/65">
              Manage your support requests from one place.
            </p>
          </div>

          <button
            onClick={() => dispatch(logout())}
            className="rounded-lg border border-stone px-5 py-2.5 text-sm font-semibold transition hover:bg-ivory dark:border-[#55595D] dark:hover:bg-[#25282B]"
          >
            Sign Out
          </button>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-stone/80 bg-white p-6 shadow-sm dark:border-[#55595D] dark:bg-[#34383C]">
            <p className="text-sm text-charcoal/60 dark:text-ivory/60">
              My Tickets
            </p>
            <h2 className="mt-3 text-2xl font-semibold">View Tickets</h2>
            <p className="mt-2 text-sm text-charcoal/65 dark:text-ivory/65">
              Track your existing support requests.
            </p>
          </div>

          <div className="rounded-2xl border border-stone/80 bg-white p-6 shadow-sm dark:border-[#55595D] dark:bg-[#34383C]">
            <p className="text-sm text-charcoal/60 dark:text-ivory/60">
              Support
            </p>
            <h2 className="mt-3 text-2xl font-semibold">Create a Ticket</h2>
            <p className="mt-2 text-sm text-charcoal/65 dark:text-ivory/65">
              Get help with a technical issue.
            </p>
          </div>

          <div className="rounded-2xl border border-stone/80 bg-white p-6 shadow-sm dark:border-[#55595D] dark:bg-[#34383C]">
            <p className="text-sm text-charcoal/60 dark:text-ivory/60">
              Account
            </p>
            <h2 className="mt-3 text-2xl font-semibold">My Profile</h2>
            <p className="mt-2 text-sm text-charcoal/65 dark:text-ivory/65">
              Review your account information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
