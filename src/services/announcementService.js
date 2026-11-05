
import { api } from './api';

export const announcementApi = api.injectEndpoints({
    endpoints: (builder) => ({

        // Get announcements visible to current user
        getMyAnnouncements: builder.query({
            query: () => '/announcements/my',
            providesTags: [
                { type: 'Announcement', id: 'MY_LIST' },
            ],
        }),

        // Get all announcements for admin and IT manager
        getAllAnnouncements: builder.query({
            query: () => '/announcements',
            providesTags: [
                { type: 'Announcement', id: 'ALL_LIST' },
            ],
        }),

        // Create announcement
        createAnnouncement: builder.mutation({
            query: (announcementData) => ({
                url: '/announcements',
                method: 'POST',
                body: announcementData,
            }),
            invalidatesTags: [
                { type: 'Announcement', id: 'MY_LIST' },
                { type: 'Announcement', id: 'ALL_LIST' },
            ],
        }),

        // Update announcement
        updateAnnouncement: builder.mutation({
            query: ({ id, ...announcementData }) => ({
                url: `/announcements/${id}`,
                method: 'PUT',
                body: announcementData,
            }),
            invalidatesTags: [
                { type: 'Announcement', id: 'MY_LIST' },
                { type: 'Announcement', id: 'ALL_LIST' },
            ],
        }),

        // Delete announcement
        deleteAnnouncement: builder.mutation({
            query: (announcementId) => ({
                url: `/announcements/${announcementId}`,
                method: 'DELETE',
            }),
            invalidatesTags: [
                { type: 'Announcement', id: 'MY_LIST' },
                { type: 'Announcement', id: 'ALL_LIST' },
            ],
        }),

        // Mark announcement as read
        markAnnouncementAsRead: builder.mutation({
            query: (announcementId) => ({
                url: `/announcements/${announcementId}/read`,
                method: 'PUT',
            }),
            invalidatesTags: [
                { type: 'Announcement', id: 'MY_LIST' },
            ],
        }),

        // Mark all announcements as read
        markAllAnnouncementsAsRead: builder.mutation({
            query: () => ({
                url: '/announcements/read-all',
                method: 'PUT',
            }),
            invalidatesTags: [
                { type: 'Announcement', id: 'MY_LIST' },
            ],
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
