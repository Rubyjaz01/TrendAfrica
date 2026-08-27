import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import FollowButton from "../components/FollowButton";
import PostCard from "../components/PostCard";

import {
  getUserById,
  type PublicUser,
} from "../services/user.service";

export default function UserProfilePage() {
  const { id } =
    useParams<{ id: string }>();

  const [user, setUser] =
    useState<PublicUser | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadUser() {
      if (!id) {
        setError(
          "Invalid user ID"
        );
        setLoading(false);
        return;
      }

      const userId =
        Number(id);

      if (
        !Number.isInteger(
          userId
        ) ||
        userId <= 0
      ) {
        setError(
          "Invalid user ID"
        );
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response =
          await getUserById(
            userId
          );

        setUser(
          response.data
        );
      } catch (error: any) {
        console.error(
          "Failed to load user:",
          error
        );

        setError(
          error.response?.data
            ?.message ||
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
      <div className="mx-auto max-w-3xl p-4">
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
          <p className="text-gray-500">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl p-4">
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
          <p className="font-medium text-red-600">
            {error ||
              "User not found"}
          </p>

          <Link
            to="/explore"
            className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5 p-4">

      {/* Profile header */}

      <section className="overflow-hidden rounded-2xl bg-white shadow-sm">

        {/* Cover */}

        <div className="h-48 bg-gray-200">
          {user.coverImage ? (
            <img
              src={
                user.coverImage
              }
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-r from-gray-200 to-gray-300">
              <span className="text-sm font-medium text-gray-500">
                TrendAfrica
              </span>
            </div>
          )}
        </div>

        {/* Profile identity */}

        <div className="px-6 pb-6">

          <div className="-mt-14 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div className="flex items-end gap-4">

              {user.avatar ? (
                <img
                  src={
                    user.avatar
                  }
                  alt={
                    user.fullName
                  }
                  className="h-28 w-28 rounded-full border-4 border-white object-cover shadow"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-gray-200 text-4xl font-bold text-gray-600 shadow">
                  {user.fullName
                    .charAt(0)
                    .toUpperCase()}
                </div>
              )}

              <div className="pb-1">
                <h1 className="text-2xl font-bold text-gray-900">
                  {
                    user.fullName
                  }
                </h1>

                {user.username && (
                  <p className="text-gray-500">
                    @
                    {
                      user.username
                    }
                  </p>
                )}
              </div>
            </div>

            <FollowButton
              userId={
                user.id
              }
            />
          </div>

          {/* Bio */}

          {user.bio && (
            <p className="mt-5 text-gray-700">
              {user.bio}
            </p>
          )}

          {/* Location / website */}

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">

            {user.location && (
              <span>
                📍{" "}
                {
                  user.location
                }
              </span>
            )}

            {user.website && (
              <a
                href={
                  user.website
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                🌐{" "}
                {
                  user.website
                }
              </a>
            )}

          </div>

          {/* Statistics */}

          <div className="mt-6 flex flex-wrap gap-6 border-t pt-5">

            <div>
              <p className="font-bold text-gray-900">
                {
                  user._count
                    .posts
                }
              </p>

              <p className="text-sm text-gray-500">
                Posts
              </p>
            </div>

            <Link
              to={`/users/${user.id}/followers`}
              className="hover:underline"
            >
              <p className="font-bold text-gray-900">
                {
                  user._count
                    .followers
                }
              </p>

              <p className="text-sm text-gray-500">
                Followers
              </p>
            </Link>

            <Link
              to={`/users/${user.id}/following`}
              className="hover:underline"
            >
              <p className="font-bold text-gray-900">
                {
                  user._count
                    .following
                }
              </p>

              <p className="text-sm text-gray-500">
                Following
              </p>
            </Link>

          </div>

        </div>
      </section>

      {/* Posts */}

      <section>

        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Posts
          </h2>

          <p className="text-sm text-gray-500">
            Posts shared by{" "}
            {
              user.fullName
            }
          </p>
        </div>

        {user.posts.length ===
        0 ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <p className="text-gray-500">
              No posts yet.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {user.posts.map(
              (post) => (
                <PostCard
                  key={
                    post.id
                  }
                  post={post}
                />
              )
            )}
          </div>
        )}

      </section>

    </div>
  );
}