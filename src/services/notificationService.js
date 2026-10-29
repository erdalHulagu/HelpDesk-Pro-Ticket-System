import { api } from './api';

export const notificationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all notifications
    getNotifications: builder.query({
      query: () => '/notifications',
      providesTags: ['Notification'],
    }),

    // Get unread notification count
    getUnreadCount: builder.query({
      query: () => '/notifications/unread-count',
      transformResponse: (response) => response.unreadCount,
      providesTags: ['Notification'],
    }),

    // Mark one notification as read
    markNotificationAsRead: builder.mutation({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}/read`,
        method: 'PUT',
      }),
      invalidatesTags: ['Notification'],
    }),

    // Mark all notifications as read
    markAllNotificationsAsRead: builder.mutation({
      query: () => ({
        url: '/notifications/read-all',
        method: 'PUT',
      }),
      invalidatesTags: ['Notification'],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
} = notificationApi;
