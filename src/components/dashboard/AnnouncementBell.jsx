import { useEffect, useRef, useState } from 'react';

import {
    useGetMyAnnouncementsQuery,
    useMarkAnnouncementAsReadMutation,
    useMarkAllAnnouncementsAsReadMutation,
} from '../../services/announcementService.js';

function AnnouncementBell({ darkMode = false }) {
    const [isOpen, setIsOpen] = useState(false);
    const [actionError, setActionError] = useState('');

    const panelRef = useRef(null);

    const {
        data,
        isLoading,
        isError,
        refetch,
    } = useGetMyAnnouncementsQuery(undefined, {
        pollingInterval: 60000,
    });

    const [
        markAnnouncementAsRead,
        { isLoading: isMarkingAsRead },
    ] = useMarkAnnouncementAsReadMutation();

    const [
        markAllAsRead,
        { isLoading: isMarkingAllAsRead },
    ] = useMarkAllAnnouncementsAsReadMutation();

    const announcements = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
            ? data.data
            : [];

    const unreadCount = announcements.filter(
        (announcement) => !announcement.read
    ).length;

    useEffect(() => {
        function handleOutsideClick(event) {
            if (
                panelRef.current &&
                !panelRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        }

        function handleEscape(event) {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleOutsideClick);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
            document.removeEventListener('keydown', handleEscape);
        };
    }, []);

    function formatDate(date) {
        if (!date) return '';

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) return '';

        return new Intl.DateTimeFormat('en-GB', {
            dateStyle: 'medium',
            timeStyle: 'short',
        }).format(parsedDate);
    }

    async function handleMarkAsRead(announcementId) {
        try {
            setActionError('');

            await markAnnouncementAsRead(announcementId).unwrap();
        } catch (error) {
            console.error('Unable to mark announcement as read:', error);
            setActionError(
                error?.data?.error || 'Unable to mark announcement as read.'
            );
        }
    }

    async function handleMarkAllAsRead() {
        try {
            setActionError('');

            await markAllAsRead().unwrap();
        } catch (error) {
            console.error('Unable to mark all announcements as read:', error);
            setActionError(
                error?.data?.error || 'Unable to mark all announcements as read.'
            );
        }
    }

    const boxStyle = darkMode
        ? 'border-[#55595D] bg-[#34383C] hover:border-champagne'
        : 'border-stone/70 bg-white/70 hover:border-champagne';

    const colors = darkMode
        ? 'border-[#55595D] bg-[#34383C] text-ivory'
        : 'border-stone/70 bg-ivory text-charcoal';

    return (
        <div ref={panelRef} className="relative shrink-0">

            {/* Announcement Button */}
            <button
                type="button"
                onClick={() => {
                    const nextState = !isOpen;
                    setIsOpen(nextState);

                    if (nextState) {
                        setActionError('');
                        refetch();
                    }
                }}
                aria-label={`Announcements: ${unreadCount} unread`}
                aria-expanded={isOpen}
                className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-champagne ${boxStyle}`}
            >
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                    aria-hidden="true"
                >
                    <path d="M3 11v2a2 2 0 0 0 2 2h2l3 5h3l-2-5" />
                    <path d="M7 15V9l13-5v16L7 15Z" />
                    <path d="M20 9l2 1M20 15l2-1" />
                </svg>

                {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-champagne px-1 text-[10px] font-bold text-charcoal">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Announcement Window */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:p-6 "
                    onClick={(event) => {
                        if (event.target === event.currentTarget) {
                            setIsOpen(false);
                        }
                    }}
                >
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="announcement-heading"
                        className={`flex max-h-[90dvh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border shadow-2xl ${colors}`}
                    >

                        {/* Header */}
                        <header className="flex items-center justify-between border-b border-stone/50 p-5 dark:border-[#55595D]">
                            <div>
                                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-champagne">
                                    Helpdesk Portal
                                </p>

                                <h2
                                    id="announcement-heading"
                                    className="mt-1 text-xl font-semibold"
                                >
                                    Announcements
                                </h2>

                                <p className="mt-1 text-xs opacity-60">
                                    {unreadCount > 0
                                        ? `You have ${unreadCount} unread announcement(s).`
                                        : 'You are all caught up.'}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                aria-label="Close announcements"
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-stone/70 text-xl hover:bg-champagne/10 dark:border-[#55595D]"
                            >
                                ×
                            </button>
                        </header>

                        {/* Content */}
                        <div className="users-scrollbar min-h-0 flex-1 space-y-4 overflow-auto p-5">

                            {/* Mark All as Read */}
                            {!isLoading && !isError && unreadCount > 0 && (
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={handleMarkAllAsRead}
                                        disabled={isMarkingAllAsRead}
                                        className="rounded-lg border border-champagne px-4 py-2 text-xs font-semibold text-champagne transition hover:bg-champagne hover:text-charcoal disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {isMarkingAllAsRead
                                            ? 'Marking all as read...'
                                            : 'Mark all as read'}
                                    </button>
                                </div>
                            )}

                            {isLoading && (
                                <p className="py-10 text-center text-sm opacity-60">
                                    Loading announcements...
                                </p>
                            )}

                            {isError && (
                                <div className="py-10 text-center">
                                    <p className="text-sm text-red-500">
                                        Unable to load announcements.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={refetch}
                                        className="mt-3 text-sm font-semibold text-champagne hover:underline"
                                    >
                                        Try again
                                    </button>
                                </div>
                            )}

                            {actionError && (
                                <p
                                    role="alert"
                                    className="rounded-lg bg-red-500/10 p-3 text-sm text-red-500"
                                >
                                    {actionError}
                                </p>
                            )}

                            {!isLoading && !isError && announcements.length === 0 && (
                                <p className="py-10 text-center text-sm opacity-60">
                                    There are no announcements at the moment.
                                </p>
                            )}

                            {!isLoading && !isError && announcements.map((announcement) => (
                                <article
                                    key={announcement.id}
                                    className={`rounded-xl border p-4 ${
                                        announcement.pinned
                                            ? 'border-champagne/70 bg-champagne/5'
                                            : 'border-stone/70 bg-white/50 dark:border-[#55595D] dark:bg-[#2D3033]'
                                    } ${
                                        announcement.read ? 'opacity-75' : ''
                                    }`}
                                >

                                    {/* Announcement Title */}
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h3 className="text-base font-semibold">
                                            {announcement.title}
                                        </h3>

                                        {announcement.pinned && (
                                            <span className="rounded-full bg-champagne/20 px-2 py-1 text-[10px] font-semibold">
                                                Pinned
                                            </span>
                                        )}

                                        {announcement.read && (
                                            <span className="rounded-full bg-green-500/15 px-2 py-1 text-[10px] font-semibold text-green-600 dark:text-green-400">
                                                Read
                                            </span>
                                        )}

                                        {!announcement.read && (
                                            <span className="rounded-full bg-champagne/20 px-2 py-1 text-[10px] font-semibold">
                                                New
                                            </span>
                                        )}
                                    </div>

                                    {/* Message */}
                                    <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 opacity-80">
                                        {announcement.message}
                                    </p>

                                    {/* Metadata */}
                                    <div className="mt-4 flex flex-wrap justify-between gap-2 border-t border-stone/50 pt-3 text-xs opacity-60 dark:border-[#55595D]">
                                        <span>
                                            {announcement.createdByUsername
                                                ? `By ${announcement.createdByUsername}`
                                                : 'Administrator'}
                                        </span>

                                        <span>
                                            {formatDate(announcement.createdAt)}
                                        </span>
                                    </div>

                                    {/* Read Date */}
                                    {announcement.read && announcement.readAt && (
                                        <p className="mt-2 text-xs opacity-50">
                                            Read on: {formatDate(announcement.readAt)}
                                        </p>
                                    )}

                                    {/* Mark as Read */}
                                    <div className="mt-4 flex justify-end">
                                        {!announcement.read ? (
                                            <button
                                                type="button"
                                                disabled={isMarkingAsRead || isMarkingAllAsRead}
                                                onClick={() => handleMarkAsRead(announcement.id)}
                                                className="rounded-lg bg-champagne px-4 py-2 text-xs font-semibold text-charcoal transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                {isMarkingAsRead
                                                    ? 'Marking...'
                                                    : 'Mark as read'}
                                            </button>
                                        ) : (
                                            <span className="text-xs font-medium text-green-600 dark:text-green-400">
                                                ✓ Already read
                                            </span>
                                        )}
                                    </div>

                                </article>
                            ))}

                        </div>

                        {/* Footer */}
                        <footer className="flex justify-end border-t border-stone/50 p-4 dark:border-[#55595D]">
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="rounded-lg bg-champagne px-5 py-2 text-sm font-semibold text-charcoal transition hover:opacity-90"
                            >
                                Close
                            </button>
                        </footer>

                    </section>
                </div>
            )}
        </div>
    );
}

export default AnnouncementBell;
