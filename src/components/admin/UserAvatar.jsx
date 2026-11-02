
import { useGetUserProfilePhotoQuery } from '../../services/profileService';

const UserAvatar = ({ user }) => {
  const {
    data: photo,
    isError,
  } = useGetUserProfilePhotoQuery(user.id, {
    skip: !user.id,
  });

  const initials = (user.username || user.email || '?')
    .trim()
    .charAt(0)
    .toUpperCase();

  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-stone/80 bg-champagne/20 text-sm font-semibold text-charcoal dark:border-[#55595D] dark:text-ivory">
      {photo && !isError ? (
        <img
          src={photo}
          alt={`${user.username || 'User'} profile`}
          className="h-full w-full rounded-full object-cover"
        />
      ) : (
        initials
      )}
    </div>
  );
};

export default UserAvatar;