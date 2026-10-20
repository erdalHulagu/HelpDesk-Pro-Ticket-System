
const QuickActionCard = ({ onCreateTicket }) => {
  return (
    <section className="rounded-xl border border-stone/70 bg-white p-4 shadow-sm dark:border-[#55595D] dark:bg-[#34383C] sm:p-5">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-champagne/15 text-xl text-champagne">
          +
        </span>

        <div className="min-w-0">
          <h2 className="text-base font-semibold">Quick Actions</h2>
          <p className="mt-1 text-xs text-charcoal/60 dark:text-ivory/60">
            Get support when you need it.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onCreateTicket}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-charcoal px-4 py-2.5 text-sm font-medium text-white transition hover:bg-charcoal/90 focus:outline-none focus:ring-2 focus:ring-champagne focus:ring-offset-2 dark:bg-champagne dark:text-[#292929] dark:hover:bg-champagne/90 dark:focus:ring-offset-[#34383C]"
      >
        <span aria-hidden="true">+</span>
        Create New Ticket
      </button>
    </section>
  );
};

export default QuickActionCard;
