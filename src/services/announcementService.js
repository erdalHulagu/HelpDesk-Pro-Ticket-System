
import { api } from './api';

export const announcementApi = api.injectEndpoints({
  endpoints: (builder) => ({

    // Get announcements visible to current user
    getMyAnnouncements: builder.query({
      query: () => '/announcements/my',
      providesTags: ['Announcement'],
    }),

    // Get all announcements (ADMIN)
    getAllAnnouncements: builder.query({
      query: () => '/announcements',
      providesTags: ['Announcement'],
    }),

    // Create announcement
    createAnnouncement: builder.mutation({
      query: (announcementData) => ({
        url: '/announcements',
        method: 'POST',
        body: announcementData,
      }),
      invalidatesTags: ['Announcement'],
    }),

    // Update announcement
    updateAnnouncement: builder.mutation({
      query: ({ id, ...announcementData }) => ({
        url: `/announcements/${id}`,
        method: 'PUT',
        body: announcementData,
      }),
      invalidatesTags: ['Announcement'],
    }),

    // Delete announcement
    deleteAnnouncement: builder.mutation({
      query: (announcementId) => ({
        url: `/announcements/${announcementId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Announcement'],
    }),

    // Mark announcement as read
    markAnnouncementAsRead: builder.mutation({
      query: (announcementId) => ({
        url: `/announcements/${announcementId}/read`,
        method: 'PUT',
      }),
      invalidatesTags: ['Announcement'],
    }),

    markAllAnnouncementsAsRead: builder.mutation({
      query: () => ({
        url: '/announcements/read-all',
        method: 'PUT',
      }),
      invalidatesTags: ['Announcement'],
    }),

  }),
});

export const {
  useGetMyAnnouncementsQuery,
  useGetAllAnnouncementsQuery,
  useCreateAnnouncementMutation,
  useUpdateAnnouncementMutation,
  useDeleteAnnouncementMutation,
  useMarkAnnouncementAsReadMutation,
  useMarkAllAnnouncementsAsReadMutation,
} = announcementApi;
