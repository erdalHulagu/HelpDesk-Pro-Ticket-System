
const StatCard = ({
  label,
  value,
  marker,
  accent,
  active = false,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`min-w-0 rounded-lg border px-2.5 py-2 text-left transition duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne sm:px-3 ${
        active
          ? 'border-champagne bg-champagne/10 shadow-sm'
          : 'border-stone/70 bg-white hover:border-champagne/70 dark:border-[#55595D] dark:bg-[#34383C]'
      }`}
    >
      <div className="flex items-center justify-between gap-1.5">
        <p className="truncate text-[11px] font-medium text-charcoal/65 dark:text-ivory/65 sm:text-xs">
          {label}
        </p>

        <span
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-semibold ${accent}`}
          aria-hidden="true"
        >
          {marker}
        </span>
      </div>

      <p className="mt-1 text-xl font-semibold tracking-tight text-charcoal dark:text-ivory sm:text-2xl">
        {value}
      </p>

      <div
        className={`mt-1.5 h-0.5 rounded-full transition-all ${
          active ? 'w-full bg-champagne' : 'w-7 bg-champagne/60'
        }`}
      />
    </button>
  );
};

export default StatCard;
