
import { api } from './api';

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: () => '/users',
      providesTags: ['User'],
    }),

    getUserById: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: ['User'],
    }),

    updateUser: builder.mutation({
      query: ({ id, ...userData }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),

    getITSupportUsers: builder.query({
      query: () => '/users/it-support',
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useGetITSupportUsersQuery,
} = userApi;
