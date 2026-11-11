
import { api } from "./api";

export const assetAssignmentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all assignments
    getAllAssignments: builder.query({
      query: () => "/asset-assignments",
      providesTags: ["AssetAssignment"],
    }),

    // Get assignment by ID
    getAssignmentById: builder.query({
      query: (id) => `/asset-assignments/${id}`,
      providesTags: ["AssetAssignment"],
    }),

    // Get assignments by user
    getAssignmentsByUser: builder.query({
      query: (userId) => `/asset-assignments/user/${userId}`,
      providesTags: ["AssetAssignment"],
    }),

    // Get assignments by asset
    getAssignmentsByAsset: builder.query({
      query: (assetId) => `/asset-assignments/asset/${assetId}`,
      providesTags: ["AssetAssignment"],
    }),

    // Assign asset to user
    assignAsset: builder.mutation({
      query: ({ assetId, userId, notes }) => ({
        url: "/asset-assignments",
        method: "POST",
        body: {
          asset: { id: assetId },
          user: { id: userId },
          notes: notes || "",
        },
      }),
      invalidatesTags: ["AssetAssignment", "Asset"],
    }),

    // Return asset
    returnAsset: builder.mutation({
      query: (assignmentId) => ({
        url: `/asset-assignments/${assignmentId}/return`,
        method: "PUT",
      }),
      invalidatesTags: ["AssetAssignment", "Asset"],
    }),
  }),
});

export const {
  useGetAllAssignmentsQuery,
  useGetAssignmentByIdQuery,
  useGetAssignmentsByUserQuery,
  useGetAssignmentsByAssetQuery,
  useAssignAssetMutation,
  useReturnAssetMutation,
} = assetAssignmentApi;
