
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


// Export users as Excel
export const exportUsersExcel = async ({
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
    ? `/api/export/users?${queryString}`
    : '/api/export/users';

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to export users.');
  }

  return response.blob();
};
