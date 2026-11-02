const AdminHeader = ({ onBack }) => {
  return (
    <div className="mb-3 flex items-center justify-between gap-3 border-b border-stone/70 pb-2 dark:border-[#55595D]">
      <div className="flex min-w-0 items-center gap-2">
        <p className="text-[10px] font-medium uppercase tracking-wider text-champagne">
          Administration
        </p>

        <span className="text-charcoal/40 dark:text-ivory/40">/</span>

        <h2 className="text-base font-semibold">
          Admin Panel
        </h2>
      </div>

      <button
        type="button"
        onClick={onBack}
        className="shrink-0 rounded-lg border border-stone px-3 py-1.5 text-xs font-medium transition hover:border-champagne hover:bg-champagne/10 dark:border-[#55595D]"
      >
        Back
      </button>
    </div>
  );
};

export default AdminHeader;