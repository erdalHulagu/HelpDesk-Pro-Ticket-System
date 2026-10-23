import { api } from './api';

const readImageResponse = async (response) => {
  if (!response.ok) {
    throw new Error('Profile photo not found');
  }

  const blob = await response.blob();

  return await new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;

    reader.readAsDataURL(blob);
  });
};

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
      invalidatesTags: ['ProfilePhoto'],
    }),

    getProfilePhoto: builder.query({
      query: () => ({
        url: '/attachments/user/photo',
        method: 'GET',
        responseHandler: readImageResponse,
      }),
      providesTags: ['ProfilePhoto'],
    }),

    getUserProfilePhoto: builder.query({
      query: (userId) => ({
        url: `/attachments/user/photo/by-user?userId=${userId}`,
        method: 'GET',
        responseHandler: readImageResponse,
      }),
    }),
  }),
});

export const {
  useUploadProfilePhotoMutation,
  useGetProfilePhotoQuery,
  useGetUserProfilePhotoQuery,
} = profileApi;