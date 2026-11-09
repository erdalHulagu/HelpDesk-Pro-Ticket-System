
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import TicketCard from './TicketCard';
import TicketComments from '../tickets/TicketComments.jsx';

import {
  useUpdateTicketStatusMutation,
  useAssignTicketMutation,
  useDeleteTicketMutation,
} from '../../../services/ticketService.js';

import { useGetITSupportUsersQuery } from '../../../services/userService.js';

const formatDate = (value) => {
  if (!value) return 'Not available';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return 'Not available';

  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getSlaDisplay = (ticket) => {
  if (!ticket) {
    return { label: 'Unknown', className: 'bg-stone/20 text-charcoal/60' };
  }

  const status = String(ticket.slaStatus || '').toUpperCase();

  if (status === 'COMPLETED') {
    return {
      label: 'Completed',
      className:
        'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
    };
  }

  if (status === 'BREACHED') {
    return {
      label: 'Breached',
      className:
        'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
    };
  }

  if (status === 'AT_RISK') {
    return {
      label: 'At Risk',
      className:
        'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
    };
  }

  if (status === 'ON_TRACK') {
    return {
      label: 'On Track',
      className:
        'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
    };
  }

  const resolved = ['RESOLVED', 'CLOSED'].includes(ticket.status);

  if (resolved) {
    return {
      label: 'Completed',
      className:
        'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
    };
  }

  if (ticket.slaDueAt) {
    const dueDate = new Date(ticket.slaDueAt);

    if (!Number.isNaN(dueDate.getTime()) && dueDate.getTime() < Date.now()) {
      return {
        label: 'Overdue',
        className:
          'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
      };
    }

    return {
      label: 'Within SLA',
      className:
        'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
    };
  }

  return {
    label: 'Unknown',
    className: 'bg-stone/20 text-charcoal/60 dark:text-ivory/60',
  };
};

const TicketList = ({
  tickets,
  isLoading,
  isError,
  selectedTicketId: externalSelectedTicketId,
  onTicketSelectionHandled,
  selectedStatus,
}) => {
  const role = useSelector((state) => state.auth.role);
  const token = useSelector((state) => state.auth.token);

  const showCreator = role === 'ADMIN' || role === 'IT_MANAGER';
  const canAssign = role === 'ADMIN' || role === 'IT_MANAGER';

  const ticketList = Array.isArray(tickets) ? tickets : [];

  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [assignedToId, setAssignedToId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('ALL');

  const [updateTicketStatus, { isLoading: isUpdatingStatus }] =
    useUpdateTicketStatusMutation();

  const [assignTicket, { isLoading: isAssigning }] =
    useAssignTicketMutation();

  const [deleteTicket, { isLoading: isDeleting }] =
    useDeleteTicketMutation();

  const {
    data: itSupportUsers = [],
    isLoading: isLoadingITSupport,
    isError: isITSupportError,
  } = useGetITSupportUsersQuery(undefined, {
    skip: !canAssign,
  });

  const visibleTickets = ticketList.filter((ticket) => {
    const search = searchTerm.trim().toLowerCase();

    const matchesSearch =
      !search ||
      [
        ticket.title,
        ticket.description,
        ticket.category,
        ticket.createdByUsername,
        ticket.id,
      ].some((value) =>
        String(value ?? '').toLowerCase().includes(search)
      );

    const matchesPriority =
      selectedPriority === 'ALL' ||
      String(ticket.priority || '').toUpperCase() === selectedPriority;

    const matchesStatus =
      !selectedStatus ||
      selectedStatus === 'ALL' ||
      ticket.status === selectedStatus;

    return matchesSearch && matchesPriority && matchesStatus;
  });

  const selectedTicket = visibleTickets.find(
    (ticket) => String(ticket.id) === String(selectedTicketId)
  );

  useEffect(() => {
    if (externalSelectedTicketId == null) return;

    const targetTicket = ticketList.find(
      (ticket) => String(ticket.id) === String(externalSelectedTicketId)
    );

    if (targetTicket) {
      setSelectedTicketId(targetTicket.id);
      onTicketSelectionHandled?.();
    }
  }, [externalSelectedTicketId, ticketList, onTicketSelectionHandled]);

  useEffect(() => {
    if (
      selectedTicketId !== null &&
      !ticketList.some(
        (ticket) => String(ticket.id) === String(selectedTicketId)
      )
    ) {
      setSelectedTicketId(null);
    }
  }, [selectedTicketId, ticketList]);

  useEffect(() => {
    setAssignedToId(
      selectedTicket?.assignedToId
        ? String(selectedTicket.assignedToId)
        : ''
    );
  }, [selectedTicket?.id, selectedTicket?.assignedToId]);

  useEffect(() => {
    if (externalSelectedTicketId != null) return;

    if (
      selectedTicketId !== null &&
      !visibleTickets.some(
        (ticket) => String(ticket.id) === String(selectedTicketId)
      )
    ) {
      setSelectedTicketId(null);
    }
  }, [selectedTicketId, visibleTickets, externalSelectedTicketId]);

  const handleStatusChange = async (event) => {
    if (!selectedTicket) return;

    try {
      await updateTicketStatus({
        id: selectedTicket.id,
        status: event.target.value,
      }).unwrap();
    } catch (error) {
      console.error('Unable to update ticket status:', error);
    }
  };

  const handleAssignTicket = async () => {
    if (!selectedTicket || !assignedToId) return;

    try {
      await assignTicket({
        id: selectedTicket.id,
        assignedToId: Number(assignedToId),
      }).unwrap();
    } catch (error) {
      console.error('Unable to assign ticket:', error);
    }
  };

  const handleDeleteTicket = async () => {
    if (!selectedTicket) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ticket "${selectedTicket.title}"?`
    );

    if (!confirmed) return;

    try {
      await deleteTicket(selectedTicket.id).unwrap();
      setSelectedTicketId(null);
    } catch (error) {
      console.error('Unable to delete ticket:', error);
      alert('Unable to delete ticket. Please try again.');
    }
  };

  const selectClassName =
    'mt-1 w-full rounded-lg border border-stone/70 bg-white px-3 py-2 text-sm text-charcoal outline-none transition focus:border-champagne focus:ring-2 focus:ring-champagne/30 disabled:cursor-not-allowed disabled:opacity-60 dark:border-[#55595D] dark:bg-[#292D31] dark:text-ivory';

  const labelClassName =
    'text-[10px] font-semibold uppercase tracking-wider text-charcoal/50 dark:text-ivory/50';

  const slaDisplay = getSlaDisplay(selectedTicket);

  const InfoItem = ({ label, value }) => (
    <div className="min-w-0 rounded-lg bg-stone/10 px-3 py-2 dark:bg-[#292D31]/60">
      <p className={labelClassName}>{label}</p>
      <p className="mt-1 break-words text-sm font-medium text-charcoal dark:text-ivory">
        {value || 'Not available'}
      </p>
    </div>
  );

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden">
      <header className="mb-3 flex shrink-0 items-center justify-between gap-3 border-b border-stone/60 pb-3 dark:border-[#55595D]">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-charcoal/50 dark:text-ivory/50">
            Support workspace
          </p>

          <h2 className="mt-0.5 text-base font-semibold text-charcoal dark:text-ivory">
            Tickets
          </h2>

          <p className="mt-0.5 text-xs text-charcoal/60 dark:text-ivory/60">
            {isLoading
              ? 'Loading tickets...'
              : `${ticketList.length} ${ticketList.length === 1 ? 'ticket' : 'tickets'
              }`}
          </p>
        </div>

        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-champagne/30 bg-champagne/10 text-lg text-champagne">
          ◈
        </span>
      </header>

      <div className="mb-3 grid shrink-0 grid-cols-1 gap-2 rounded-lg border border-stone/60 bg-stone/5 p-2 dark:border-[#55595D] dark:bg-[#292D31]/40 sm:grid-cols-[minmax(0,1fr)_170px]">
        <input
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search tickets..."
          aria-label="Search tickets"
          className="min-w-0 rounded-lg border border-stone/70 bg-white px-3 py-2 text-sm text-charcoal outline-none focus:border-champagne focus:ring-2 focus:ring-champagne/30 dark:border-[#55595D] dark:bg-[#292D31] dark:text-ivory"
        />

        <select
          value={selectedPriority}
          onChange={(event) => setSelectedPriority(event.target.value)}
          aria-label="Filter by priority"
          className="rounded-lg border border-stone/70 bg-white px-3 py-2 text-sm text-charcoal outline-none focus:border-champagne dark:border-[#55595D] dark:bg-[#292D31] dark:text-ivory"
        >
          <option value="ALL">All Priorities</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="CRITICAL">Critical</option>
        </select>
      </div>

      {isLoading && (
        <p className="py-4 text-sm text-charcoal/60 dark:text-ivory/60">
          Loading tickets...
        </p>
      )}

      {isError && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300"
        >
          Unable to load tickets. Please try again.
        </p>
      )}

      {!isLoading && !isError && visibleTickets.length === 0 && (
        <p className="py-6 text-center text-sm text-charcoal/60 dark:text-ivory/60">
          No tickets match your filters.
        </p>
      )}

      {!isLoading && !isError && visibleTickets.length > 0 && (
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 overflow-hidden lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          {/* Ticket list */}
          <div className="ticket-scrollbar min-h-0 space-y-2 overflow-y-auto overscroll-contain pr-1">
            <p className="sticky top-0 z-10 bg-white/95 py-1 text-[10px] font-semibold uppercase tracking-wider text-charcoal/50 backdrop-blur dark:bg-[#34383C]/95 dark:text-ivory/50">
              Showing {visibleTickets.length} of {ticketList.length} tickets
            </p>

            {visibleTickets.map((ticket) => {
              const isSelected =
                String(ticket.id) === String(selectedTicketId);

              return (
                <button
                  key={ticket.id}
                  type="button"
                  onClick={() => setSelectedTicketId(ticket.id)}
                  aria-pressed={isSelected}
                  className={`block w-full rounded-xl text-left outline-none transition focus-visible:ring-2 focus-visible:ring-champagne ${isSelected
                    ? 'ring-2 ring-champagne/70'
                    : 'hover:opacity-90'
                    }`}
                >
                  <TicketCard ticket={ticket} showCreator={showCreator} />
                </button>
              );
            })}
          </div>

          {/* Selected ticket details */}
          <section
            aria-label="Selected ticket details"
            className="ticket-scrollbar min-h-0 overflow-y-auto rounded-xl border border-stone/60 bg-stone/10 p-3 dark:border-[#55595D] dark:bg-[#292D31]/50 sm:p-4"
          >
            {!selectedTicket ? (
              <div className="flex min-h-40 flex-col items-center justify-center px-4 py-8 text-center">
                <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-champagne/30 bg-champagne/10 text-xl text-champagne">
                  ◈
                </span>

                <h3 className="text-sm font-semibold text-charcoal dark:text-ivory">
                  Select a ticket
                </h3>

                <p className="mt-1 max-w-xs text-xs leading-5 text-charcoal/60 dark:text-ivory/60">
                  Choose a ticket from the list to view its details and comments.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Overview */}
                <div className="border-b border-stone/60 pb-3 dark:border-[#55595D]">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className={labelClassName}>Ticket overview</p>

                    <span className="rounded-full bg-stone/20 px-2.5 py-1 text-[10px] font-semibold text-charcoal/70 dark:bg-[#41464B] dark:text-ivory/70">
                      #{selectedTicket.id}
                    </span>
                  </div>

                  <h3 className="mt-2 break-words text-lg font-semibold text-charcoal dark:text-ivory">
                    {selectedTicket.title || 'Untitled ticket'}
                  </h3>

                  <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-charcoal/75 dark:text-ivory/75">
                    {selectedTicket.description || 'No description provided.'}
                  </p>
                </div>

                {/* Ticket properties */}
                <div>
                  <p className={`${labelClassName} mb-2`}>Ticket information</p>

                  <div className="grid grid-cols-2 gap-2">
                    <InfoItem
                      label="Status"
                      value={String(selectedTicket.status || 'OPEN').replaceAll('_', ' ')}
                    />

                    <InfoItem
                      label="Priority"
                      value={selectedTicket.priority || 'Not available'}
                    />

                    <InfoItem
                      label="Category"
                      value={selectedTicket.category || 'Not specified'}
                    />

                    <InfoItem
                      label="Created"
                      value={formatDate(selectedTicket.createdAt)}
                    />
                  </div>
                </div>

                {/* SLA */}
                <div className="rounded-xl border border-stone/60 bg-white/60 p-3 dark:border-[#55595D] dark:bg-[#292D31]/60">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className={labelClassName}>Service Level Agreement</p>
                      <p className="mt-1 text-sm font-semibold text-charcoal dark:text-ivory">
                        SLA Overview
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${slaDisplay.className}`}
                    >
                      {slaDisplay.label}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <p className={labelClassName}>Deadline</p>
                      <p className="mt-1 text-sm font-medium text-charcoal dark:text-ivory">
                        {formatDate(selectedTicket.slaDueAt)}
                      </p>
                    </div>

                    <div>
                      <p className={labelClassName}>Remaining time</p>
                      <p className="mt-1 text-sm font-medium text-charcoal dark:text-ivory">
                        {selectedTicket.slaRemainingTime ||
                          (['RESOLVED', 'CLOSED'].includes(selectedTicket.status)
                            ? 'Completed'
                            : selectedTicket.slaDueAt
                              ? 'See deadline'
                              : 'Not available')}
                      </p>
                    </div>

                    {selectedTicket.resolvedAt && (
                      <div className="sm:col-span-2">
                        <p className={labelClassName}>Resolved at</p>
                        <p className="mt-1 text-sm font-medium text-charcoal dark:text-ivory">
                          {formatDate(selectedTicket.resolvedAt)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* People */}
                <div>
                  <p className={`${labelClassName} mb-2`}>People</p>


                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {showCreator && (
                      <InfoItem
                        label="Created by"
                        value={selectedTicket.createdByUsername || 'Unknown'}
                      />
                    )}

                    <InfoItem
                      label="Assigned to"
                      value={
                        selectedTicket.assignedToUsername ||
                        itSupportUsers.find(
                          (user) =>
                            Number(user.id) === Number(selectedTicket.assignedToId)
                        )?.username ||
                        'Unassigned'
                      }
                    />
                  </div>

                  {showCreator && selectedTicket.createdByRole && (
                    <p className="mt-2 text-xs text-charcoal/55 dark:text-ivory/55">
                      Creator role:{' '}
                      {selectedTicket.createdByRole.replaceAll('_', ' ')}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="rounded-xl border border-stone/60 bg-white/60 p-3 dark:border-[#55595D] dark:bg-[#292D31]/60">
                  <p className={`${labelClassName} mb-3`}>Ticket actions</p>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor={`status-${selectedTicket.id}`}
                        className={labelClassName}
                      >
                        Update status
                      </label>

                      <select
                        id={`status-${selectedTicket.id}`}
                        value={selectedTicket.status || 'OPEN'}
                        disabled={isUpdatingStatus}
                        onChange={handleStatusChange}
                        className={selectClassName}
                      >
                        <option value="OPEN">Open</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="RESOLVED">Resolved</option>
                        <option value="CLOSED">Closed</option>
                      </select>

                      {isUpdatingStatus && (
                        <p className="mt-1 text-xs text-charcoal/55 dark:text-ivory/55">
                          Updating status...
                        </p>
                      )}
                    </div>

                    {canAssign && (
                      <div>
                        <label className={labelClassName}>
                          Assign to IT Support
                        </label>

                        {isLoadingITSupport ? (
                          <p className="mt-2 text-sm text-charcoal/60 dark:text-ivory/60">
                            Loading support users...
                          </p>
                        ) : isITSupportError ? (
                          <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                            Unable to load IT Support users.
                          </p>
                        ) : (
                          <>
                            <select
                              value={assignedToId}
                              onChange={(event) =>
                                setAssignedToId(event.target.value)
                              }
                              disabled={isAssigning}
                              className={selectClassName}
                            >
                              <option value="">
                                Select an IT Support user
                              </option>

                              {itSupportUsers.map((supportUser) => (
                                <option
                                  key={supportUser.id}
                                  value={supportUser.id}
                                >
                                  {supportUser.username}
                                </option>
                              ))}
                            </select>

                            <button
                              type="button"
                              onClick={handleAssignTicket}
                              disabled={
                                !assignedToId ||
                                isAssigning ||
                                String(selectedTicket.assignedToId || '') ===
                                assignedToId
                              }
                              className="mt-2 w-full rounded-lg bg-champagne px-3 py-2 text-sm font-semibold text-charcoal transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {isAssigning ? 'Assigning...' : 'Assign Ticket'}
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {canAssign && itSupportUsers.length === 0 && !isLoadingITSupport && !isITSupportError && (
                    <p className="mt-2 text-xs text-charcoal/60 dark:text-ivory/60">
                      No active IT Support users found.
                    </p>
                  )}

                  {canAssign && (
                    <button
                      type="button"
                      onClick={handleDeleteTicket}
                      disabled={isDeleting}
                      className="mt-3 w-full rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-900/40"
                    >
                      {isDeleting ? 'Deleting...' : 'Delete Ticket'}
                    </button>
                  )}
                </div>

                {/* Comments */}
                <div className="border-t border-stone/60 pt-3 dark:border-[#55595D]">
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-charcoal dark:text-ivory">
                      Comments
                    </h4>
                  </div>

                  <TicketComments
                    ticketId={selectedTicket.id}
                    token={token}
                  />
                </div>
              </div>
            )}
          </section>
        </div>
      )}
    </section>
  );
};

export default TicketList;
