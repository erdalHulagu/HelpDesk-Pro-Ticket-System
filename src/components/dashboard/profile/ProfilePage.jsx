
import { useEffect, useRef, useState } from 'react';
import {
useUploadProfilePhotoMutation,
  useGetProfilePhotoQuery,
} from '../../../services/profileService';
const ProfilePage = ({ username, email, onBack, onLogout }) => {
  const fileInputRef = useRef(null);
  const [photoUrl, setPhotoUrl] = useState(null);
const [photoError, setPhotoError] = useState('');

const { data: profilePhotoBlob } = useGetProfilePhotoQuery();

useEffect(() => {
  if (!profilePhotoBlob || profilePhotoBlob.size === 0) return;

  const objectUrl = URL.createObjectURL(profilePhotoBlob);
  setPhotoUrl(objectUrl);

  return () => {
    URL.revokeObjectURL(objectUrl);
  };
}, [profilePhotoBlob]);

  const [uploadProfilePhoto, { isLoading: isUploadingPhoto }] =
    useUploadProfilePhotoMutation();

  const handlePhotoChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setPhotoError('Please select an image file.');
      event.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setPhotoError('The image must be smaller than 5 MB.');
      event.target.value = '';
      return;
    }

    setPhotoError('');

    try {
      await uploadProfilePhoto(file).unwrap();

      setPhotoUrl(URL.createObjectURL(file));
    } catch {
      setPhotoError('Unable to upload profile photo. Please try again.');
    } finally {
      event.target.value = '';
    }
  };

  return (
    <section className="ticket-scrollbar min-h-0 flex-1 overflow-y-auto rounded-xl border border-stone/70 bg-white p-4 shadow-sm dark:border-[#55595D] dark:bg-[#34383C] sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-champagne">
            Account
          </p>
          <h2 className="mt-1 text-xl font-semibold">My Profile</h2>
          <p className="mt-1 text-sm text-charcoal/60 dark:text-ivory/60">
            View your account information.
          </p>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="shrink-0 rounded-full border border-stone px-3 py-2 text-xs font-medium transition hover:border-champagne hover:bg-champagne/10 dark:border-[#55595D] sm:text-sm"
        >
          Back
        </button>
      </div>

      <div className="mx-auto mt-8 max-w-xl">
        <div className="flex flex-col items-center rounded-2xl border border-stone/60 bg-ivory/60 p-6 dark:border-[#55595D] dark:bg-[#2B2E31] sm:p-8">
          <div className="relative">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingPhoto}
              aria-label="Change profile photo"
              className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-2 border-champagne bg-champagne/10 text-champagne transition hover:opacity-80 disabled:opacity-60 sm:h-32 sm:w-32"
            >
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  className="h-16 w-16"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path
                    d="M4.5 21a7.5 7.5 0 0 1 15 0"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handlePhotoChange}
            />

            <span className="pointer-events-none absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-white bg-emerald-500 dark:border-[#2B2E31]" />
          </div>

          <p className="mt-2 text-xs text-charcoal/60 dark:text-ivory/60">
            {isUploadingPhoto ? 'Uploading photo...' : 'Click the photo to change it'}
          </p>

          {photoError && (
            <p role="alert" className="mt-2 text-sm text-red-600 dark:text-red-400">
              {photoError}
            </p>
          )}

          <h3 className="mt-4 break-words text-xl font-semibold">
            {username || 'User'}
          </h3>

          <p className="mt-1 text-sm text-charcoal/60 dark:text-ivory/60">
            Helpdesk User
          </p>

          <div className="mt-7 w-full space-y-4">
            <div className="rounded-xl border border-stone/60 bg-white p-4 dark:border-[#55595D] dark:bg-[#34383C]">
              <p className="text-xs font-medium uppercase tracking-wider text-charcoal/50 dark:text-ivory/50">
                Username
              </p>
              <p className="mt-1 break-words text-sm font-medium">
                {username || 'Not available'}
              </p>
            </div>

            <div className="rounded-xl border border-stone/60 bg-white p-4 dark:border-[#55595D] dark:bg-[#34383C]">
              <p className="text-xs font-medium uppercase tracking-wider text-charcoal/50 dark:text-ivory/50">
                Email Address
              </p>
              <p className="mt-1 break-all text-sm font-medium">
                {email || 'Not available'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="mt-6 w-full rounded-full border border-red-300 px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30"
          >
            Sign Out
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
