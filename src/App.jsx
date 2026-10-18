
import { useEffect, useState } from 'react';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import { useSelector } from 'react-redux';
import Dashboard from './components/dashboard/Dashboard';


const App = () => {
  const token = useSelector((state) => state.auth.token);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('helpdesk-theme') === 'dark';
  });

  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem(
      'helpdesk-theme',
      darkMode ? 'dark' : 'light'
    );
  }, [darkMode]);
if (token) {
  return (
    <Dashboard
      darkMode={darkMode}
      onToggleTheme={() => setDarkMode((current) => !current)}
    />
  );
}

  return (
    
    <main className="min-h-screen bg-ivory text-charcoal transition-colors duration-300 dark:bg-[#25282B] dark:text-ivory">
      <header className="flex items-center justify-between border-b border-stone px-6 py-4 dark:border-[#55595D] md:px-12">
        <h1 className="text-2xl font-bold tracking-wide">
          Helpdesk<span className="text-champagne">.</span>
        </h1>

        <button
          type="button"
          onClick={() => setDarkMode((current) => !current)}
          className="flex items-center gap-2 rounded-full border border-stone px-4 py-2 transition hover:bg-stone/40 dark:border-[#55595D] dark:hover:bg-white/10"
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <span aria-hidden="true">
            {darkMode ? '☀️' : '🌙'}
          </span>
          <span className="text-sm font-medium">
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </span>
        </button>
      </header>

      <section className="flex min-h-[calc(100vh-73px)] items-center justify-center px-5 py-12">
        <div className="w-full max-w-md min-h-[590px] flex flex-col justify-center">
          {showRegister ? (
            <Register />
          ) : (
            <Login />
          )}

          <p className="mt-6 text-center text-sm text-charcoal/70 dark:text-ivory/70">
            {showRegister
  ? 'Already have an account? '
  : "Don't have an account yet? "}

            <button
              type="button"
              onClick={() => setShowRegister((current) => !current)}
              className="font-semibold text-charcoal underline decoration-champagne decoration-2 underline-offset-4 hover:text-champagne dark:text-champagne"
            >
             {showRegister ? 'Sign In' : 'Create Account'}
            </button>
          </p>
        </div>
      </section>
    </main>
  );
}

export default App;
