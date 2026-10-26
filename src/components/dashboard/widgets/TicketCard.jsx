
const TicketCard = ({ ticket, showCreator, }) => {
  const statusStyles = {
    CLOSED:
      'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200',
    IN_PROGRESS:
      'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
    RESOLVED:
      'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
    OPEN:
      'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  };

  const priorityStyles = {
    CRITICAL:
      'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
    HIGH:
      'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
    MEDIUM:
      'bg-[#f4ead4] text-[#80643a] dark:bg-[#514633] dark:text-[#e6cb99]',
    LOW:
      'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200',
  };

  const priorityIndicators = {
    CRITICAL: 'bg-red-500',
    HIGH: 'bg-orange-400',
    MEDIUM: 'bg-champagne',
    LOW: 'bg-emerald-500/70',
  };

  const status = ticket.status || 'OPEN';
  const priority = ticket.priority || 'LOW';

  return (
    <article className="group relative overflow-hidden rounded-lg border border-stone/60 bg-white/80 px-3 py-2 transition-colors hover:border-champagne/70 dark:border-[#55595D] dark:bg-[#34383C]">
      <div
        className={`absolute bottom-2 left-0 top-2 w-0.5 rounded-r-full ${
          priorityIndicators[priority] || priorityIndicators.LOW
        }`}
      />

      <div className="min-w-0 pl-2">
        <div className="flex min-w-0 items-start justify-between gap-2">
          <h3 className="min-w-0 break-words text-[13px] font-semibold leading-5">
            {ticket.title || 'Untitled ticket'}
          </h3>

          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
              statusStyles[status] || statusStyles.OPEN
            }`}
          >
            {status.replaceAll('_', ' ')}
          </span>
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-1.5">
  <span
    className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
      priorityStyles[priority] || priorityStyles.LOW
    }`}
  >
    {priority}
  </span>

  {ticket.category && (
    <span className="text-[10px] text-charcoal/60 dark:text-ivory/60">
      {ticket.category}
    </span>
  )}
</div>

        {showCreator && (
          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[10px]">
            <span className="font-medium text-[#96743A] dark:text-[#fcfdfb]">
              {ticket.createdByUsername || 'Unknown'}
            </span>

            {ticket.createdByRole && (
              <span className="rounded-full bg-[#F4EAD4] px-1.5 py-0.5 text-[#80643A] dark:bg-[#524a3cce] dark:text-[#fcfdfb]">
                {ticket.createdByRole.replaceAll('_', ' ')}
              </span>
            )}
          </div>
        )}

        {ticket.description && (
          <p className="mt-1 line-clamp-2 break-words text-xs leading-4 text-charcoal/65 dark:text-ivory/65">
            {ticket.description}
          </p>
        )}
      </div>
    </article>
  );
};

export default TicketCard;
