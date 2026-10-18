
import { useState } from 'react';
import { useLoginMutation } from '../../services/authService';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../features/auth/authSlice';

const Login=()=> {

    const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, { isLoading, error }] = useLoginMutation();

  async function handleSubmit(event) {
    event.preventDefault();

    try {
    
const result = await login({ email, password }).unwrap();

dispatch(setCredentials({
  token: result.token,
  userId: result.userId,
  username: result.username,
}));
console.log(result)

    } catch (err) {
      console.error('Login failed:', err);
    }
  }

  return (
    <div className="flex min-h-[540px] w-full flex-col justify-center rounded-2xl border border-stone/80 bg-white p-8 shadow-lg shadow-charcoal/5 dark:border-[#55595D] dark:bg-[#34383C] sm:p-10">
      <div className="mb-8">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-champagne/25 text-2xl">
          ◈
        </div>

        <h2 className="text-3xl font-semibold tracking-tight">
          Welcome Back
        </h2>

        <p className="mt-2 text-sm text-charcoal/65 dark:text-ivory/65">
          Sign in to your Helpdesk account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium"
          >
            Email Address
          </label>

          <input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            placeholder="name@company.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="w-full rounded-lg border border-stone bg-ivory px-4 py-3 text-charcoal outline-none transition placeholder:text-charcoal/40 focus:border-charcoal focus:ring-2 focus:ring-champagne/60 dark:border-[#55595D] dark:bg-[#25282B] dark:text-ivory"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium"
          >
            Password
          </label>

          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="w-full rounded-lg border border-stone bg-ivory px-4 py-3 text-charcoal outline-none transition placeholder:text-charcoal/40 focus:border-charcoal focus:ring-2 focus:ring-champagne/60 dark:border-[#55595D] dark:bg-[#25282B] dark:text-ivory"
          />
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-600 dark:text-red-400">
            {error.data?.message || 'Unable to sign in. Please check your credentials and try again.'}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-charcoal px-4 py-3 font-semibold text-white transition hover:bg-charcoal/90 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-champagne focus:ring-offset-2 dark:bg-champagne dark:text-charcoal dark:hover:bg-[#d2b991] dark:focus:ring-offset-[#34383C]"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-charcoal/50 dark:text-ivory/50">
        Your secure company support portal
      </p>
    </div>
  );
}

export default Login;
