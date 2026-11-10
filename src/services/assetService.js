
import { api } from './api';

export const assetApi = api.injectEndpoints({
  endpoints: (builder) => ({

    // Get all assets
    getAllAssets: builder.query({
      query: () => '/assets',
      providesTags: ['Asset'],
    }),

    // Get asset by ID
    getAssetById: builder.query({
      query: (id) => `/assets/${id}`,
      providesTags: ['Asset'],
    }),

    // Get asset by tag
    getAssetByTag: builder.query({
      query: (assetTag) => `/assets/tag/${assetTag}`,
      providesTags: ['Asset'],
    }),

    // Filter assets by status
    getAssetsByStatus: builder.query({
      query: (status) => `/assets/status/${status}`,
      providesTags: ['Asset'],
    }),

    // Create asset
    createAsset: builder.mutation({
      query: (assetData) => ({
        url: '/assets',
        method: 'POST',
        body: assetData,
      }),
      invalidatesTags: ['Asset'],
    }),

    // Update asset
    updateAsset: builder.mutation({
      query: ({ id, ...assetData }) => ({
        url: `/assets/${id}`,
        method: 'PUT',
        body: assetData,
      }),
      invalidatesTags: ['Asset'],
    }),

    // Retire asset
    retireAsset: builder.mutation({
      query: (id) => ({
        url: `/assets/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Asset'],
    }),

  }),
});

export const {
  useGetAllAssetsQuery,
  useGetAssetByIdQuery,
  useGetAssetByTagQuery,
  useGetAssetsByStatusQuery,
  useCreateAssetMutation,
  useUpdateAssetMutation,
  useRetireAssetMutation,
} = assetApi;
