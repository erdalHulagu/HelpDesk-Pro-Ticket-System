
const StatCard = ({ label, value, marker, accent }) => {
  return (
    <article className="min-w-0 rounded-xl border border-stone/70 bg-white p-3 shadow-sm transition duration-200 hover:border-champagne/70 dark:border-[#55595D] dark:bg-[#34383C] sm:p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-xs font-medium text-charcoal/60 dark:text-ivory/60 sm:text-sm">
          {label}
        </p>

        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-sm font-semibold ${accent}`}
          aria-hidden="true"
        >
          {marker}
        </span>
      </div>

      <p className="mt-2 text-2xl font-semibold tracking-tight sm:mt-3 sm:text-3xl">
        {value}
      </p>

      <div className="mt-2 h-0.5 w-9 rounded-full bg-champagne/70" />
    </article>
  );
};

export default StatCard;
