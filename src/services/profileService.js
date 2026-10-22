
import { api } from './api';

export const profileApi = api.injectEndpoints({
  endpoints: (builder) => ({
    uploadProfilePhoto: builder.mutation({
      query: (file) => ({
        url: '/attachments/user/photo',
        method: 'POST',
        headers: {
          'Content-Type': file.type,
          'X-File-Name': encodeURIComponent(file.name),
        },
        body: file,
      }),
    }),

    getProfilePhoto: builder.query({
      query: () => ({
        url: '/attachments/user/photo',
        method: 'GET',
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const {
  useUploadProfilePhotoMutation,
  useGetProfilePhotoQuery,
} = profileApi;
