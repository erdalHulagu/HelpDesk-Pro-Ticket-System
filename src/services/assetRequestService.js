
import { api } from "./api";

export const assetRequestApi = api.injectEndpoints({
    endpoints: (builder) => ({
        // Employee: Get own requests
        getMyAssetRequests: builder.query({
            query: () => "/asset-requests/my",
            providesTags: ["AssetRequest"],
        }),

        // Admin / IT Support: Get all requests
        getAllAssetRequests: builder.query({
            query: () => "/asset-requests",
            providesTags: ["AssetRequest"],
        }),

        // Get requests by status
        getAssetRequestsByStatus: builder.query({
            query: (status) => `/asset-requests/status/${status}`,
            providesTags: ["AssetRequest"],
        }),

        // Get request by ID
        getAssetRequestById: builder.query({
            query: (id) => `/asset-requests/${id}`,
            providesTags: ["AssetRequest"],
        }),

        // Employee: Create request
        createAssetRequest: builder.mutation({
            query: ({ category, description }) => ({
                url: "/asset-requests",
                method: "POST",
                body: { category, description },
            }),
            invalidatesTags: ["AssetRequest"],
        }),

        // Admin / IT Support: Approve or reject
        reviewAssetRequest: builder.mutation({
            query: ({ id, status }) => ({
                url: `/asset-requests/${id}/review`,
                method: "PUT",
                body: { status },
            }),
            invalidatesTags: ["AssetRequest"],
        }),

        // Employee: Cancel own request
        cancelAssetRequest: builder.mutation({
            query: (id) => ({
                url: `/asset-requests/${id}/cancel`,
                method: "PUT",
            }),
            invalidatesTags: ["AssetRequest"],
        }),

        // Admin / IT Support: Fulfill approved request
        fulfillAssetRequest: builder.mutation({
            query: ({ id, assetId }) => ({
                url: `/asset-requests/${id}/fulfill`,
                method: "PUT",
                body: {
                    asset: { id: assetId },
                },
            }),
            invalidatesTags: ["AssetRequest", "AssetAssignment", "Asset"],
        }),
    }),
});

export const {
    useGetMyAssetRequestsQuery,
    useGetAllAssetRequestsQuery,
    useGetAssetRequestsByStatusQuery,
    useGetAssetRequestByIdQuery,
    useCreateAssetRequestMutation,
    useReviewAssetRequestMutation,
    useCancelAssetRequestMutation,
    useFulfillAssetRequestMutation,
} = assetRequestApi;
