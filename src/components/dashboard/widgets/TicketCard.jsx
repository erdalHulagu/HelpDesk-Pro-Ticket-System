
const TicketCard = ({ ticket,showCreator }) => {
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
    <article className="group relative overflow-hidden rounded-xl border border-stone/60 bg-white/80 p-3.5 shadow-sm transition-all duration-200 hover:border-champagne/70 hover:shadow-md dark:border-[#55595D] dark:bg-[#34383C]">
      <div
        className={`absolute bottom-3 left-0 top-3 w-0.5 rounded-r-full ${
          priorityIndicators[priority] || priorityIndicators.LOW
        }`}
      />

      <div className="pl-2">
        <div className="flex min-w-0 flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div className="min-w-0">
            <h3 className="break-words text-sm font-semibold">
              {ticket.title}
            </h3>

          {showCreator && (
  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
    <span className="font-semibold text-[#96743A] dark:text-[#E6CB99]">
      Created by: {ticket.createdByUsername || 'Unknown'}
    </span>

    {ticket.createdByRole && (
      <span className="rounded-full border border-[#C9A96E]/50 bg-[#F4EAD4] px-2 py-0.5 font-medium text-[#80643A] dark:border-[#C9A96E]/40 dark:bg-[#514633] dark:text-[#E6CB99]">
        {ticket.createdByRole.replaceAll('_', ' ')}
      </span>
    )}
  </div>
)}

          </div>

          <span
            className={`w-fit shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
              statusStyles[status] || statusStyles.OPEN
            }`}
          >
            {status.replaceAll('_', ' ')}
          </span>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="text-xs text-charcoal/60 dark:text-ivory/60">
            Priority:
          </span>

          <span
            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
              priorityStyles[priority] || priorityStyles.LOW
            }`}
          >
            {priority}
          </span>
        </div>

        {ticket.description && (
          <p className="mt-2 break-words text-sm leading-5 text-charcoal/70 dark:text-ivory/70">
            {ticket.description}
          </p>
        )}
      </div>
    </article>
  );
};

export default TicketCard;
