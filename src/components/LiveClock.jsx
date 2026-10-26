
import { useEffect, useState } from 'react';

const LiveClock = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div
      className="hidden shrink-0 rounded-lg border border-stone/70 bg-white/70 px-3 py-1.5 dark:border-[#55595D] dark:bg-[#34383C] sm:block"
      aria-label="Local date and time"
    >
      <div className="flex items-center gap-2">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          className="h-4 w-4 text-champagne"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
          <path
            d="M12 7v5l3 2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <span className="font-mono text-sm font-semibold tabular-nums">
          {now.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })}
        </span>
      </div>

      <p className="mt-1 text-right text-[10px] text-charcoal/60 dark:text-ivory/60">
        {now.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })}
      </p>
    </div>
  );
};

export default LiveClock;
