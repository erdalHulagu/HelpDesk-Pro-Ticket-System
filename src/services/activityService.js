
import { api } from './api';

export const activityApi = api.injectEndpoints({
    endpoints: (builder) => ({
        // Get all activities accessible to the current user
        getAllActivities: builder.query({
            query: () => '/activities',
        }),

        // Get activities for a specific ticket
        getTicketActivities: builder.query({
            query: (ticketId) => `/activities/ticket/${ticketId}`,
        }),
    }),
});

export const {
    useGetAllActivitiesQuery,
    useGetTicketActivitiesQuery,
} = activityApi;