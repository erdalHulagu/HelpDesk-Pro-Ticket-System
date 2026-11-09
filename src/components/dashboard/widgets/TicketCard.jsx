
const TicketCard = ({ ticket, showCreator }) => {
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

  const slaStyles = {
    ON_TRACK:
      'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
    AT_RISK:
      'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
    BREACHED:
      'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
    COMPLETED:
      'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
  };

  const status = String(ticket.status || 'OPEN').toUpperCase();
  const priority = String(ticket.priority || 'LOW').toUpperCase();

  const slaDueAt = ticket.slaDueAt
    ? new Date(ticket.slaDueAt)
    : null;

  const hasValidSlaDate =
    slaDueAt && !Number.isNaN(slaDueAt.getTime());

  const isResolved = ['RESOLVED', 'CLOSED'].includes(status);

  const backendSlaStatus = String(ticket.slaStatus || '').toUpperCase();

  const fallbackSlaStatus = !hasValidSlaDate
    ? 'UNKNOWN'
    : isResolved
      ? 'COMPLETED'
      : slaDueAt.getTime() < Date.now()
        ? 'BREACHED'
        : 'ON_TRACK';

  const slaStatus = backendSlaStatus || fallbackSlaStatus;

  const slaLabel = {
    ON_TRACK: 'On Track',
    AT_RISK: 'At Risk',
    BREACHED: 'Breached',
    COMPLETED: 'Completed',
    UNKNOWN: 'No SLA',
  }[slaStatus] || 'Unknown';

  const formatDate = (value) => {
    if (!value) return null;

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return null;

    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const createdAt = formatDate(ticket.createdAt);
  const assignedTo =
    ticket.assignedToUsername ||
    ticket.assignedTo?.username ||
    (ticket.assignedToId ? `User #${ticket.assignedToId}` : 'Unassigned');

  return (
    <article className="group relative overflow-hidden rounded-xl border border-stone/60 bg-white/80 px-3 py-3 transition-all hover:border-champagne/80 hover:shadow-sm dark:border-[#55595D] dark:bg-[#34383C]">
      {/* Priority indicator */}
      <div
        className={`absolute bottom-3 left-0 top-3 w-1 rounded-r-full ${
          priorityIndicators[priority] || priorityIndicators.LOW
        }`}
      />

      <div className="min-w-0 pl-2">
        {/* Title and status */}
        <div className="flex min-w-0 items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="break-words text-sm font-semibold leading-5 text-charcoal dark:text-ivory">
              {ticket.title || 'Untitled ticket'}
            </h3>

            <p className="mt-0.5 text-[10px] text-charcoal/45 dark:text-ivory/45">
              Ticket #{ticket.id}
            </p>
          </div>

          <span
            className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold ${
              statusStyles[status] || statusStyles.OPEN
            }`}
          >
            {status.replaceAll('_', ' ')}
          </span>
        </div>

        {/* Priority and category */}
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
              priorityStyles[priority] || priorityStyles.LOW
            }`}
          >
            {priority}
          </span>

          {ticket.category && (
            <span className="rounded-full border border-stone/60 px-2 py-0.5 text-[10px] text-charcoal/65 dark:border-[#55595D] dark:text-ivory/65">
              {ticket.category}
            </span>
          )}
        </div>

        {/* Description */}
        {ticket.description && (
          <p className="mt-2 line-clamp-2 break-words text-xs leading-5 text-charcoal/65 dark:text-ivory/65">
            {ticket.description}
          </p>
        )}

        {/* SLA information */}
        <div className="mt-3 rounded-lg border border-stone/50 bg-stone/5 px-2.5 py-2 dark:border-[#55595D] dark:bg-[#292D31]/50">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-charcoal/50 dark:text-ivory/50">
              SLA
            </span>

            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                slaStyles[slaStatus] ||
                'bg-stone/20 text-charcoal/60 dark:text-ivory/60'
              }`}
            >
              {slaLabel}
            </span>
          </div>

          {hasValidSlaDate && (
            <div className="mt-1.5 flex flex-wrap items-center justify-between gap-1">
              <span className="text-[10px] text-charcoal/55 dark:text-ivory/55">
                Due: {formatDate(ticket.slaDueAt)}
              </span>

              {ticket.slaRemainingTime && (
                <span className="text-[10px] font-medium text-charcoal/70 dark:text-ivory/70">
                  {ticket.slaRemainingTime}
                </span>
              )}
            </div>
          )}

          {!hasValidSlaDate && (
            <p className="mt-1 text-[10px] text-charcoal/50 dark:text-ivory/50">
              SLA deadline not available
            </p>
          )}
        </div>

        {/* People and creation date */}
        <div className="mt-3 grid grid-cols-1 gap-1.5">
          {showCreator && (
            <div className="flex min-w-0 items-center justify-between gap-2 text-[10px]">
              <span className="shrink-0 text-charcoal/50 dark:text-ivory/50">
                Created by
              </span>

              <span className="truncate font-medium text-charcoal dark:text-ivory">
                {ticket.createdByUsername || 'Unknown'}
                {ticket.createdByRole &&
                  ` · ${ticket.createdByRole.replaceAll('_', ' ')}`}
              </span>
            </div>
          )}

          <div className="flex min-w-0 items-center justify-between gap-2 text-[10px]">
            <span className="shrink-0 text-charcoal/50 dark:text-ivory/50">
              Assigned to
            </span>

            <span className="truncate font-medium text-charcoal dark:text-ivory">
              {assignedTo}
            </span>
          </div>

          {createdAt && (
            <div className="flex min-w-0 items-center justify-between gap-2 text-[10px]">
              <span className="shrink-0 text-charcoal/50 dark:text-ivory/50">
                Created
              </span>

              <span className="truncate text-charcoal/70 dark:text-ivory/70">
                {createdAt}
              </span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default TicketCard;
