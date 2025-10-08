import React from "react";
import DEFAULT_PROFILE_PICTURE from "../../public/default_user.webp"

const AvatarGroup = ({ avatars, maxVisible = 3 }) => {
  return (
    <div className="flex items-center">
      {avatars.slice(0, maxVisible).map((avatar, index) => (
        <img
          key={index}
          src={avatar || DEFAULT_PROFILE_PICTURE}
          alt={`Avatar ${index}`}
          className="w-9 h-9 rounded-full border-2 border-white -ml-3 first:ml-0"
        />
      ))}

      {avatars.length > maxVisible && (
        <div className="w-9 h-9 items-center justify-center bg-blue-50 text-sm font-medium rounded-full border-2 border-white -ml-3 ">
          +{avatars.length - maxVisible}
        </div>
      )}
    </div>
  );
};

export default AvatarGroup;
