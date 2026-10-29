import { useEffect, useRef, useState } from 'react';
import {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
} from '../../services/notificationService.js';

function NotificationBell({ darkMode = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef(null);

  const {
    data: notifications = [],
    isLoading,
    isError,
    refetch,
  } = useGetNotificationsQuery();

  const { data: unreadCount = 0 } = useGetUnreadCountQuery();

  const [markAsRead, { isLoading: isMarkingOne }] =
    useMarkNotificationAsReadMutation();

  const [markAllAsRead, { isLoading: isMarkingAll }] =
    useMarkAllNotificationsAsReadMutation();

  useEffect(() => {
    function handleClickOutside(event) {
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

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  async function handleMarkAsRead(id) {
    try {
      await markAsRead(id).unwrap();
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }

  async function handleMarkAllAsRead() {
    try {
      await markAllAsRead().unwrap();
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  }

  function getIcon(type) {
    const value = (type || '').toUpperCase();

    if (value.includes('COMMENT')) return '💬';
    if (value.includes('ASSIGN')) return '👤';
    if (value.includes('STATUS')) return '🔄';
    if (value.includes('TICKET')) return '🎫';

    return '🔔';
  }

  function formatDate(date) {
    if (!date) return '';

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return '';

    return new Intl.DateTimeFormat('en-GB', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(parsedDate);
  }

  const notificationList = Array.isArray(notifications)
    ? notifications
    : [];

  const colors = darkMode
    ? 'border-[#55595D] bg-[#34383C] text-ivory'
    : 'border-stone/70 bg-white text-charcoal';

  const mutedText = darkMode
    ? 'text-ivory/60'
    : 'text-charcoal/60';

  return (
    <div className="relative shrink-0" ref={panelRef}>
      <button
        type="button"
        onClick={() => {
          const nextState = !isOpen;
          setIsOpen(nextState);

          if (nextState) {
            refetch();
          }
        }}
        aria-label={`Notifications: ${unreadCount} unread`}
        aria-expanded={isOpen}
        className={`relative flex h-9 w-9 items-center justify-center rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-champagne ${
          darkMode
            ? 'border-[#55595D] bg-[#34383C] hover:border-champagne'
            : 'border-stone/70 bg-white/70 hover:border-champagne'
        }`}
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
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
          <path d="M10 21h4" />
        </svg>

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          ref={undefined}
          role="dialog"
          aria-label="Notifications"
          className={`absolute right-0 top-12 z-50 w-[min(360px,calc(100vw-24px))] overflow-hidden rounded-xl border shadow-xl ${colors}`}
        >
          <div className="flex items-center justify-between gap-3 border-b border-stone/50 p-4 dark:border-[#55595D]">
            <div>
              <h2 className="text-sm font-semibold">Notifications</h2>
              <p className={`mt-1 text-xs ${mutedText}`}>
                {unreadCount} unread
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                disabled={isMarkingAll}
                className="text-xs font-medium text-champagne hover:underline disabled:opacity-50"
              >
                {isMarkingAll ? 'Updating...' : 'Mark all read'}
              </button>
            )}
          </div>

          <div className="max-h-[380px] overflow-y-auto">
            {isLoading ? (
              <p className={`p-6 text-center text-sm ${mutedText}`}>
                Loading notifications...
              </p>
            ) : isError ? (
              <div className="p-6 text-center">
                <p className="text-sm">
                  Unable to load notifications.
                </p>
                <button
                  type="button"
                  onClick={refetch}
                  className="mt-2 text-sm text-champagne hover:underline"
                >
                  Try again
                </button>
              </div>
            ) : notificationList.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-2xl">🔔</p>
                <p className="mt-2 text-sm font-medium">
                  You're all caught up
                </p>
                <p className={`mt-1 text-xs ${mutedText}`}>
                  No notifications yet.
                </p>
              </div>
            ) : (
              notificationList.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex gap-3 border-b border-stone/30 p-3 last:border-b-0 dark:border-[#55595D] ${
                    !notification.read
                      ? darkMode
                        ? 'bg-champagne/10'
                        : 'bg-amber-50'
                      : ''
                  }`}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-champagne/15 text-lg">
                    {getIcon(notification.type)}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="break-words text-sm font-semibold">
                      {notification.title || 'Notification'}
                    </p>

                    <p className={`mt-1 break-words text-xs ${mutedText}`}>
                      {notification.message}
                    </p>

                    <p className={`mt-2 text-[10px] ${mutedText}`}>
                      {formatDate(notification.createdAt)}
                    </p>

                    {!notification.read && (
                      <button
                        type="button"
                        onClick={() => handleMarkAsRead(notification.id)}
                        disabled={isMarkingOne}
                        className="mt-2 text-xs font-semibold text-champagne hover:underline disabled:opacity-50"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>

                  {!notification.read && (
                    <span
                      className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500"
                      aria-label="Unread"
                    />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;