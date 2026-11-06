
import { api } from './api';

export const securityLogApi = api.injectEndpoints({
    endpoints: (builder) => ({

        // Get all security logs
        getSecurityLogs: builder.query({
            query: () => '/security-logs',
            providesTags: ['SecurityLog'],
        }),

        // Search security logs by username
        searchSecurityLogsByUsername: builder.query({
            query: (username) =>
                `/security-logs?username=${encodeURIComponent(username)}`,
            providesTags: ['SecurityLog'],
        }),

        // Filter security logs by action
        filterSecurityLogsByAction: builder.query({
            query: (action) =>
                `/security-logs?action=${encodeURIComponent(action)}`,
            providesTags: ['SecurityLog'],
        }),

    }),
});

export const {
    useGetSecurityLogsQuery,
    useSearchSecurityLogsByUsernameQuery,
    useFilterSecurityLogsByActionQuery,
} = securityLogApi;


// Export security logs as Excel
export const exportSecurityLogsExcel = async ({
    token,
    startDate,
    endDate,
}) => {

    const params = new URLSearchParams();

    if (startDate) {
        params.append('startDate', startDate);
    }

    if (endDate) {
        params.append('endDate', endDate);
    }

    const queryString = params.toString();

    const url = queryString
        ? `/api/export/security-logs?${queryString}`
        : '/api/export/security-logs';

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
            errorText || 'Failed to export security logs.'
        );
    }

    return response.blob();
};
