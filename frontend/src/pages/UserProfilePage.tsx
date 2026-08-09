import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FollowButton from "../components/FollowButton";
import {
  getUserById,
  type PublicUser,
} from "../services/user.service";

export default function UserProfilePage() {
  const { id } = useParams<{ id: string }>();

  const [user, setUser] = useState<PublicUser | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadUser() {
      if (!id) {
        setError("Invalid user ID");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await getUserById(
          Number(id)
        );

        setUser(response.data);
      } catch (error: any) {
        console.error(
          "Failed to load user:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load user profile"
        );
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [id]);

  if (loading) {
    return (
      <p className="text-center">
        Loading profile...
      </p>
    );
  }

  if (!user) {
    return (
      <p className="text-center text-red-600">
        {error || "User not found"}
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-xl bg-white p-6 shadow">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.fullName}
                className="h-20 w-20 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-200 text-2xl font-bold">
                {user.fullName
                  .charAt(0)
                  .toUpperCase()}
              </div>
            )}

            <div>
              <h1 className="text-2xl font-bold">
                {user.fullName}
              </h1>

              {user.username && (
                <p className="text-gray-500">
                  @{user.username}
                </p>
              )}
            </div>
          </div>

          <FollowButton userId={user.id} />
        </div>

        {user.bio && (
          <p className="mt-5 text-gray-700">
            {user.bio}
          </p>
        )}

        {user.location && (
          <p className="mt-3 text-sm text-gray-500">
            📍 {user.location}
          </p>
        )}

        {user.website && (
          <a
            href={user.website}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 block text-sm text-blue-600 hover:underline"
          >
            🌐 {user.website}
          </a>
        )}
      </div>
    </div>
  );
}