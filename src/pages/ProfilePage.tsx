import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../store/authStore";
import PostList from "../components/post/PostList";
import { User } from "@/types/auth.types";
import MediaUploader from "@/components/shared/media/MediaUploader";

const ProfilePage = () => {
  const { username } = useParams<{ username: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      try {
        // Use /auth/me temporarily if there's no user profile API
        // In practice, an API endpoint like /users/:username should be used
        const response = await api.get(`/auth/me`);
        setUser(response.data.user);
      } catch (err: any) {
        console.error("Failed to fetch profile:", err);
        setError(err.response?.data?.message || "Failed to load profile.");
      } finally {
        setIsLoading(false);
      }
    };

    if (username) {
      fetchUserProfile();
    }
  }, [username]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 mt-4 text-red-700 bg-red-100 rounded-lg">
        <p>{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-8 text-center bg-white rounded-lg shadow-md">
        <p className="text-xl text-gray-600">User not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="p-6 mb-8 bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center md:flex-row md:items-start">
          {/* Profile image */}
          <div className="relative mb-4 md:mb-0 md:mr-8">
            {user.profileImageUrl ? (
              <img
                src={user.profileImageUrl}
                alt={user.username}
                className="w-32 h-32 rounded-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-32 h-32 bg-gray-200 rounded-full">
                <span className="text-4xl font-medium text-gray-600">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              </div>
            )}

            {/* Profile image upload button */}
            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="absolute bottom-0 right-0 p-1 text-white bg-blue-500 rounded-full hover:bg-blue-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          </div>

          {/* Profile information */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="mb-2 text-2xl font-bold">{user.username}</h1>
            <p className="mb-2 text-lg text-gray-700">{user.fullName}</p>

            {user.bio && <p className="mb-2 text-gray-600">{user.bio}</p>}

            {user.website && (
              <p className="mb-4">
                <a
                  href={
                    user.website.startsWith("http")
                      ? user.website
                      : `https://${user.website}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {user.website}
                </a>
              </p>
            )}
          </div>
        </div>

        {/* Profile image upload form */}
        {isEditingProfile && (
          <div className="mt-6">
            <h3 className="mb-2 text-lg font-medium">Change Profile Image</h3>
            <MediaUploader type="profile" multiple={false} />
          </div>
        )}
      </div>

      {/* User posts */}
      <h2 className="mb-4 text-xl font-bold">Posts</h2>
      <PostList userId={user.id} />
    </div>
  );
};

export default ProfilePage;
