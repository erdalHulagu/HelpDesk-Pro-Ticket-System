
import { useState } from 'react';
import { useRegisterMutation } from '../../services/authService';

const Register=() => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [register, { isLoading, error, isSuccess }] =
    useRegisterMutation();

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      await register({ username, email, password }).unwrap();
      setUsername('');
      setEmail('');
      setPassword('');
    } catch (err) {
      console.error('Registration failed:', err);
    }
  }

  return (
    <div className="flex min-h-[540px] w-full flex-col justify-center rounded-2xl border border-stone/80 bg-white p-8 shadow-lg shadow-charcoal/5 dark:border-[#55595D] dark:bg-[#34383C] sm:p-10">
      <div className="mb-6">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-champagne/25 text-2xl">
          ◈
        </div>

        <h2 className="text-3xl font-semibold tracking-tight">
          Create an Account
        </h2>

        <p className="mt-2 text-sm text-charcoal/65 dark:text-ivory/65">
          Join the Helpdesk platform.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="username"
            className="mb-2 block text-sm font-medium"
          >
            Username
          </label>

          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            placeholder="Choose a username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
            className="w-full rounded-lg border border-stone bg-ivory px-4 py-3 text-charcoal outline-none transition placeholder:text-charcoal/40 focus:border-charcoal focus:ring-2 focus:ring-champagne/60 dark:border-[#55595D] dark:bg-[#25282B] dark:text-ivory"
          />
        </div>

        <div>
          <label
            htmlFor="registerEmail"
            className="mb-2 block text-sm font-medium"
          >
            Email Address
          </label>

          <input
            id="registerEmail"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="name@company.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="w-full rounded-lg border border-stone bg-ivory px-4 py-3 text-charcoal outline-none transition placeholder:text-charcoal/40 focus:border-charcoal focus:ring-2 focus:ring-champagne/60 dark:border-[#55595D] dark:bg-[#25282B] dark:text-ivory"
          />
        </div>

        <div>
          <label
            htmlFor="registerPassword"
            className="mb-2 block text-sm font-medium"
          >
            Password
          </label>

          <input
            id="registerPassword"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="Create a password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={8}
            required
            className="w-full rounded-lg border border-stone bg-ivory px-4 py-3 text-charcoal outline-none transition placeholder:text-charcoal/40 focus:border-charcoal focus:ring-2 focus:ring-champagne/60 dark:border-[#55595D] dark:bg-[#25282B] dark:text-ivory"
          />
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-600 dark:text-red-400">
           {error.status === 'PARSING_ERROR'
  ? `Server response could not be read: ${error.data}`
  : error.data?.message ||
    error.data?.error ||
    `Request failed (${error.status}). Please try again.`}
          </p>
        )}

        {isSuccess && (
          <p role="status" className="text-sm text-green-700 dark:text-green-400">
            Account created successfully. You can now sign in.
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-charcoal px-4 py-3 font-semibold text-white transition hover:bg-charcoal/90 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-champagne focus:ring-offset-2 dark:bg-champagne dark:text-charcoal dark:hover:bg-[#d2b991] dark:focus:ring-offset-[#34383C]"
        >
          {isLoading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <p className="mt-5 text-center text-xs text-charcoal/50 dark:text-ivory/50">
        Your secure company support portal
      </p>
    </div>
  );
}

export default Register;
