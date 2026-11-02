
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetAllActivitiesQuery } from '../../services/activityService.js';

const ActivityHistory = () => {
    const role = useSelector((state) => state.auth.role);

    const { data, isLoading, isError, refetch } =
        useGetAllActivitiesQuery();

    const [activeFilter, setActiveFilter] = useState('ALL');

    const canViewInternalNotes =
        ['ADMIN', 'IT_MANAGER', 'IT_SUPPORT'].includes(role);

    const activities = Array.isArray(data) ? data : [];

    const getActivityType = (activity) =>
        String(activity.activityType || '').trim().toUpperCase();

    const filters = [
        { label: 'All Activities', value: 'ALL' },
        { label: 'Ticket Updates', value: 'TICKET_UPDATES' },
        { label: 'Status History', value: 'STATUS' },
        { label: 'Assignment History', value: 'ASSIGNMENT' },
        { label: 'Comment History', value: 'COMMENTS' },
        ...(canViewInternalNotes
            ? [{ label: 'Internal Notes', value: 'INTERNAL_NOTES' }]
            : []),
    ];

    const filterActivities = (activity) => {
        const type = getActivityType(activity);

        switch (activeFilter) {
            case 'TICKET_UPDATES':
                return [
                    'TICKET_CREATED',
                    'TICKET_UPDATED',
                    'TICKET_RESOLVED',
                ].includes(type);

            case 'STATUS':
                return type === 'STATUS_CHANGED';

            case 'ASSIGNMENT':
                return type === 'ASSIGNED';

            case 'COMMENTS':
                return type === 'COMMENT_ADDED';

            case 'INTERNAL_NOTES':
                return canViewInternalNotes &&
                    type === 'INTERNAL_NOTE_ADDED';

            default:
                return true;
        }
    };

    const filteredActivities = activities.filter(filterActivities);

    const formatDate = (date) => {
        if (!date) return '—';

        return new Date(date).toLocaleString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getActivityLabel = (type) => {
        const labels = {
            TICKET_CREATED: 'Ticket Created',
            TICKET_UPDATED: 'Ticket Updated',
            STATUS_CHANGED: 'Status Changed',
            ASSIGNED: 'Assignment Changed',
            COMMENT_ADDED: 'Comment Added',
            INTERNAL_NOTE_ADDED: 'Internal Note',
            TICKET_RESOLVED: 'Ticket Resolved',
            TICKET_DELETED: 'Ticket Deleted',
        };

        const normalizedType = String(type || '').trim().toUpperCase();

        return labels[normalizedType] ||
            normalizedType.replaceAll('_', ' ') ||
            'Activity';
    };

    const getActivityColor = (type) => {
        switch (String(type || '').trim().toUpperCase()) {
            case 'TICKET_CREATED':
                return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300';

            case 'STATUS_CHANGED':
            case 'TICKET_RESOLVED':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300';

            case 'ASSIGNED':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300';

            case 'COMMENT_ADDED':
                return 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300';

            case 'INTERNAL_NOTE_ADDED':
                return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300';

            default:
                return 'bg-stone/30 text-charcoal dark:bg-[#55595D] dark:text-ivory';
        }
    };

    const getDetails = (activity) => {
        if (getActivityType(activity) === 'ASSIGNED') {
            return `${activity.oldValue || 'Unassigned'} → ${activity.newValue || 'Unassigned'}`;
        }

        if (activity.oldValue || activity.newValue) {
            return `${activity.oldValue || '—'} → ${activity.newValue || '—'}`;
        }

        return '—';
    };

    // Same visual style as dashboard navigationBoxStyle
    const navigationButtonStyle =
        'flex h-[58px] min-w-[90px] shrink-0 cursor-pointer items-center justify-center rounded-lg border px-3 text-[10px] font-semibold text-center transition hover:border-champagne hover:bg-champagne/10 focus:outline-none focus:ring-2 focus:ring-champagne';

    return (
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden">

            {/* Header */}
            <div className="flex shrink-0 flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-xl font-semibold tracking-tight">
                        Activity History
                    </h2>

                    <p className="mt-1 text-sm text-charcoal/60 dark:text-ivory/60">
                        Review activity across your accessible tickets.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={refetch}
                    className="rounded-lg border border-stone/70 px-4 py-2 text-sm font-medium transition hover:border-champagne hover:bg-champagne/10 dark:border-[#55595D]"
                >
                    Refresh
                </button>
            </div>

            {/* Activity Filters */}
            <div className="flex shrink-0 flex-wrap items-center gap-2">
                {filters.map((filter) => (
                    <button
                        key={filter.value}
                        type="button"
                        onClick={() => setActiveFilter(filter.value)}
                        aria-pressed={activeFilter === filter.value}
                        className={`${navigationButtonStyle} ${
                            activeFilter === filter.value
                                ? 'border-champagne bg-champagne/20 text-charcoal dark:border-champagne dark:bg-champagne dark:text-[#25282B]'
                                : 'border-stone/70 bg-white/70 text-charcoal dark:border-[#55595D] dark:bg-[#34383C] dark:text-ivory'
                        }`}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            {/* Activity Table */}
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-stone/70 bg-white/70 dark:border-[#55595D] dark:bg-[#34383C]">

                {isLoading ? (
                    <div className="flex flex-1 items-center justify-center text-sm text-charcoal/60 dark:text-ivory/60">
                        Loading activities...
                    </div>
                ) : isError ? (
                    <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
                        <p className="text-sm text-red-600 dark:text-red-400">
                            Unable to load activity history.
                        </p>

                        <button
                            type="button"
                            onClick={refetch}
                            className="rounded-lg border border-stone px-4 py-2 text-sm hover:bg-champagne/10"
                        >
                            Try Again
                        </button>
                    </div>
                ) : filteredActivities.length === 0 ? (
                    <div className="flex flex-1 items-center justify-center p-6 text-sm text-charcoal/60 dark:text-ivory/60">
                        No activities found.
                    </div>
                ) : (
                    <div className="users-scrollbar min-h-0 flex-1 overflow-auto">
                        <table className="w-full min-w-[850px] text-left text-sm">
                            <thead className="sticky top-0 z-10 bg-stone/20 text-xs uppercase tracking-wider text-charcoal/60 dark:bg-[#25282B] dark:text-ivory/60">
                                <tr>
                                    <th className="px-5 py-4">Date & Time</th>
                                    <th className="px-5 py-4">Activity Type</th>
                                    <th className="px-5 py-4">Description</th>
                                    <th className="px-5 py-4">Performed By</th>
                                    <th className="px-5 py-4">Ticket</th>
                                    <th className="px-5 py-4">Details</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-stone/50 dark:divide-[#55595D]">
                                {filteredActivities.map((activity) => (
                                    <tr
                                        key={activity.id}
                                        className="transition hover:bg-champagne/5"
                                    >
                                        <td className="whitespace-nowrap px-5 py-4 text-xs text-charcoal/70 dark:text-ivory/70">
                                            {formatDate(activity.createdAt)}
                                        </td>

                                        <td className="px-5 py-4">
                                            <span
                                                className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${getActivityColor(activity.activityType)}`}
                                            >
                                                {getActivityLabel(activity.activityType)}
                                            </span>
                                        </td>

                                        <td className="max-w-xs px-5 py-4">
                                            {activity.description}
                                        </td>

                                        <td className="whitespace-nowrap px-5 py-4">
                                            {activity.performedByUsername || 'Unknown'}
                                        </td>

                                        <td className="px-5 py-4">
                                            #{activity.ticketId}
                                        </td>

                                        <td className="whitespace-nowrap px-5 py-4 text-xs text-charcoal/70 dark:text-ivory/70">
                                            {getDetails(activity)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Activity Count */}
            <p className="shrink-0 text-xs text-charcoal/50 dark:text-ivory/50">
                Showing {filteredActivities.length} of {activities.length} activities
            </p>
        </div>
    );
};

export default ActivityHistory;