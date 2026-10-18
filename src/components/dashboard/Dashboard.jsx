
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { useGetMyTicketsQuery } from '../../services/api';


const Dashboard = () => {



 
  const { username } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const {
  data: tickets,
  isLoading,
  isError,
} = useGetMyTicketsQuery();


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
  <div className="flex items-center justify-between gap-3">
    <div>
      <p className="text-sm text-charcoal/60 dark:text-ivory/60">
        My Tickets
      </p>
      <h2 className="mt-2 text-3xl font-semibold">
        {Array.isArray(tickets) ? tickets.length : 0}
      </h2>
    </div>

    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-champagne/25 text-2xl">
      ◈
    </div>
  </div>

  <p className="mt-2 text-sm text-charcoal/65 dark:text-ivory/65">
    Your support requests
  </p>

  <div className="mt-6 space-y-3">
    {isLoading && <p className="text-sm">Loading tickets...</p>}

    {isError && (
      <p className="text-sm text-red-600">Unable to load tickets.</p>
    )}

    {Array.isArray(tickets) && tickets.map((ticket) => (
      <div
        key={ticket.id}
        className="rounded-xl border border-stone/70 p-4 dark:border-[#55595D]"
      >
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h3 className="font-semibold">{ticket.title}</h3>
            <p className="mt-1 text-sm text-charcoal/60 dark:text-ivory/60">
              Ticket #{ticket.id} · {ticket.category}
            </p>
          </div>

          <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
            ticket.status === 'CLOSED'
              ? 'bg-green-100 text-green-800'
              : ticket.status === 'IN_PROGRESS'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-amber-100 text-amber-800'
          }`}>
            {ticket.status.replaceAll('_', ' ')}
          </span>
        </div>

        <p className="mt-3 text-sm text-charcoal/75 dark:text-ivory/75">
          {ticket.description}
        </p>
      </div>
    ))}
  </div>
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
