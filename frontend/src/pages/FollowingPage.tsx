import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  getFollowing,
} from "../services/follow.service";

type User = {
  id: number;
  fullName: string;
  username: string | null;
  avatar: string | null;
  bio: string | null;
};

type Following = {
  followerId: number;
  followingId: number;
  createdAt: string;
  following: User;
};

export default function FollowingPage() {
  const { id } =
    useParams<{ id: string }>();

  const [users, setUsers] =
    useState<Following[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadFollowing() {
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
          await getFollowing(
            userId
          );

        setUsers(
          response.data || []
        );
      } catch (error: any) {
        console.error(
          "Failed to load following:",
          error
        );

        setError(
          error.response?.data
            ?.message ||
            "Failed to load following"
        );
      } finally {
        setLoading(false);
      }
    }

    loadFollowing();
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl p-4">
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <p className="text-gray-500">
            Loading following...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl p-4">
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <p className="text-red-600">
            {error}
          </p>

          <Link
            to={`/users/${id}`}
            className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Back to Profile
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5 p-4">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Following
          </h1>

          <p className="text-sm text-gray-500">
            People this user follows
          </p>
        </div>

        <Link
          to={`/users/${id}`}
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          Back to Profile
        </Link>
      </div>

      {users.length ===
      0 ? (
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <p className="text-gray-500">
            Not following anyone yet.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {users.map(
            (item) => (
              <Link
                key={`${item.followerId}-${item.followingId}`}
                to={`/users/${item.following.id}`}
                className="block rounded-2xl bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-center gap-3">

                  {item.following
                    .avatar ? (
                    <img
                      src={
                        item.following
                          .avatar
                      }
                      alt={
                        item.following
                          .fullName
                      }
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-lg font-bold text-gray-600">
                      {item.following
                        .fullName
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="truncate font-semibold text-gray-900">
                      {
                        item.following
                          .fullName
                      }
                    </p>

                    {item.following
                      .username && (
                      <p className="truncate text-sm text-gray-500">
                        @
                        {
                          item.following
                            .username
                        }
                      </p>
                    )}

                    {item.following
                      .bio && (
                      <p className="mt-1 line-clamp-1 text-sm text-gray-500">
                        {
                          item.following
                            .bio
                        }
                      </p>
                    )}
                  </div>

                </div>
              </Link>
            )
          )}
        </div>
      )}

    </div>
  );
}