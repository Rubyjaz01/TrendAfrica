import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import FollowButton from "../components/FollowButton";
import PostCard from "../components/PostCard";

import {
  getUserById,
  getUserStats,
  getUserPosts,
  getUserReposts,
  type PublicUser,
  type UserStats,
  type UserPost,
} from "../services/user.service";

type ProfileTab =
  | "posts"
  | "media"
  | "reposts";

export default function UserProfilePage() {
  const { id } = useParams<{
    id: string;
  }>();

  const [user, setUser] =
    useState<PublicUser | null>(null);

  const [stats, setStats] =
    useState<UserStats | null>(null);

  const [posts, setPosts] =
    useState<UserPost[]>([]);

  const [reposts, setReposts] =
    useState<UserPost[]>([]);

  const [activeTab, setActiveTab] =
    useState<ProfileTab>("posts");

  const [loading, setLoading] =
    useState(true);

  const [postsLoading, setPostsLoading] =
    useState(true);

  const [repostsLoading, setRepostsLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [postsError, setPostsError] =
    useState("");

  const [repostsError, setRepostsError] =
    useState("");

  useEffect(() => {
    async function loadProfile() {
      if (!id) {
        setError("Invalid user ID");
        setLoading(false);
        return;
      }

      const userId = Number(id);

      if (
        !Number.isInteger(userId) ||
        userId <= 0
      ) {
        setError("Invalid user ID");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response =
          await getUserById(userId);

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

    loadProfile();
  }, [id]);

  useEffect(() => {
    async function loadProfilePosts() {
      if (!id) {
        return;
      }

      const userId = Number(id);

      if (
        !Number.isInteger(userId) ||
        userId <= 0
      ) {
        return;
      }

      try {
        setPostsLoading(true);
        setPostsError("");

        const [
          statsResponse,
          postsResponse,
        ] = await Promise.all([
          getUserStats(userId),
          getUserPosts(userId),
        ]);

        setStats(statsResponse.data);
        setPosts(postsResponse.data);
      } catch (error: any) {
        console.error(
          "Failed to load profile posts:",
          error
        );

        setPostsError(
          error.response?.data?.message ||
            "Failed to load profile posts"
        );
      } finally {
        setPostsLoading(false);
      }
    }

    loadProfilePosts();
  }, [id]);

  useEffect(() => {
    async function loadProfileReposts() {
      if (
        activeTab !== "reposts" ||
        !id ||
        reposts.length > 0
      ) {
        return;
      }

      const userId = Number(id);

      if (
        !Number.isInteger(userId) ||
        userId <= 0
      ) {
        return;
      }

      try {
        setRepostsLoading(true);
        setRepostsError("");

        const response =
          await getUserReposts(userId);

        setReposts(response.data);
      } catch (error: any) {
        console.error(
          "Failed to load user reposts:",
          error
        );

        setRepostsError(
          error.response?.data?.message ||
            "Failed to load reposts"
        );
      } finally {
        setRepostsLoading(false);
      }
    }

    loadProfileReposts();
  }, [activeTab, id, reposts.length]);

  function handlePostDeleted(
    postId: number
  ) {
    setPosts((currentPosts) =>
      currentPosts.filter(
        (post) => post.id !== postId
      )
    );

    setStats((currentStats) =>
      currentStats
        ? {
            ...currentStats,
            posts: Math.max(
              0,
              currentStats.posts - 1
            ),
          }
        : currentStats
    );
  }

  function renderPost(
    post: UserPost,
    allowDelete: boolean
  ) {
    return (
      <PostCard
        key={post.id}
        post={{
          id: post.id,
          content: post.content,
          image: post.image,
          createdAt: post.createdAt,
          author: post.author,
        }}
        onPostDeleted={
          allowDelete
            ? handlePostDeleted
            : undefined
        }
      />
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="animate-pulse">
          <div className="h-48 rounded-2xl bg-gray-200 sm:h-56" />

          <div className="-mt-12 ml-6 h-24 w-24 rounded-full border-4 border-white bg-gray-300" />

          <div className="mt-5 h-6 w-48 rounded bg-gray-200" />

          <div className="mt-3 h-4 w-32 rounded bg-gray-200" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <p className="text-center text-red-600">
          {error || "User not found"}
        </p>
      </div>
    );
  }

  const mediaPosts =
    posts.filter(
      (post) => Boolean(post.image)
    );

  const visiblePosts =
    activeTab === "posts"
      ? posts
      : activeTab === "media"
      ? mediaPosts
      : reposts;

  const visibleError =
    activeTab === "reposts"
      ? repostsError
      : postsError;

  const visibleLoading =
    activeTab === "reposts"
      ? repostsLoading
      : postsLoading;

  return (
    <main className="mx-auto max-w-4xl px-4 py-6">
      {/* Profile Header */}

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {/* Cover */}

        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 sm:h-56">
          {user.coverImage ? (
            <img
              src={user.coverImage}
              alt={`${user.fullName}'s cover`}
              className="h-full w-full object-cover"
            />
          ) : (
            <>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.2),transparent_30%)]" />

              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.15),transparent_30%)]" />

              <div className="absolute bottom-0 left-0 h-px w-full bg-white/20" />
            </>
          )}
        </div>

        {/* Profile Content */}

        <div className="px-5 pb-6 sm:px-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="-mt-12">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.fullName}
                  className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-md sm:h-28 sm:w-28"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-gray-200 text-3xl font-bold text-gray-600 shadow-md sm:h-28 sm:w-28">
                  {user.fullName
                    .charAt(0)
                    .toUpperCase()}
                </div>
              )}
            </div>

            <div className="sm:pb-1">
              <FollowButton
                userId={user.id}
              />
            </div>
          </div>

          {/* Identity */}

          <div className="mt-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {user.fullName}
            </h1>

            {user.username && (
              <p className="mt-1 text-sm text-gray-500">
                @{user.username}
              </p>
            )}
          </div>

          {/* Bio */}

          {user.bio && (
            <p className="mt-4 max-w-2xl whitespace-pre-wrap text-gray-700">
              {user.bio}
            </p>
          )}

          {/* Metadata */}

          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500">
            {user.location && (
              <span className="inline-flex items-center gap-1">
                <span aria-hidden="true">
                  📍
                </span>

                {user.location}
              </span>
            )}

            {user.website && (
              <a
                href={user.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex max-w-full items-center gap-1 truncate text-blue-600 hover:underline"
              >
                <span aria-hidden="true">
                  🔗
                </span>

                <span className="truncate">
                  {user.website}
                </span>
              </a>
            )}
          </div>

          {/* Statistics */}

          <div className="mt-6 flex flex-wrap gap-7 border-t border-gray-100 pt-5">
            <div>
              <p className="text-lg font-bold text-gray-900">
                {stats?.posts ?? 0}
              </p>

              <p className="text-xs uppercase tracking-wide text-gray-500">
                Posts
              </p>
            </div>

            <div>
              <p className="text-lg font-bold text-gray-900">
                {stats?.followers ?? 0}
              </p>

              <p className="text-xs uppercase tracking-wide text-gray-500">
                Followers
              </p>
            </div>

            <div>
              <p className="text-lg font-bold text-gray-900">
                {stats?.following ?? 0}
              </p>

              <p className="text-xs uppercase tracking-wide text-gray-500">
                Following
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Profile Tabs */}

      <section className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="grid grid-cols-3 border-b border-gray-200">
          <button
            type="button"
            onClick={() =>
              setActiveTab("posts")
            }
            className={`relative px-4 py-4 text-sm font-semibold transition ${
              activeTab === "posts"
                ? "text-blue-600"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
            }`}
          >
            Posts

            {activeTab === "posts" && (
              <span className="absolute bottom-0 left-0 h-0.5 w-full bg-blue-600" />
            )}
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveTab("media")
            }
            className={`relative px-4 py-4 text-sm font-semibold transition ${
              activeTab === "media"
                ? "text-blue-600"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
            }`}
          >
            Media

            {activeTab === "media" && (
              <span className="absolute bottom-0 left-0 h-0.5 w-full bg-blue-600" />
            )}
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveTab("reposts")
            }
            className={`relative px-4 py-4 text-sm font-semibold transition ${
              activeTab === "reposts"
                ? "text-blue-600"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
            }`}
          >
            Reposts

            {activeTab === "reposts" && (
              <span className="absolute bottom-0 left-0 h-0.5 w-full bg-blue-600" />
            )}
          </button>
        </div>
      </section>

      {/* Tab Content */}

      <section className="mt-4">
        {visibleError && (
          <p className="mb-4 text-center text-sm text-red-600">
            {visibleError}
          </p>
        )}

        {visibleLoading ? (
          <div className="space-y-4">
            <div className="h-40 animate-pulse rounded-xl bg-gray-200" />

            <div className="h-40 animate-pulse rounded-xl bg-gray-200" />
          </div>
        ) : (
          <>
            {visiblePosts.length === 0 ? (
              <div className="mt-6 rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
                <p className="font-medium text-gray-700">
                  {activeTab === "posts"
                    ? "No posts yet."
                    : activeTab === "media"
                    ? "No media posts yet."
                    : "No reposts yet."}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  {activeTab === "posts"
                    ? "This user hasn't published anything yet."
                    : activeTab === "media"
                    ? "This user hasn't shared any images yet."
                    : "This user hasn't reposted anything yet."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {visiblePosts.map(
                  (post) =>
                    renderPost(
                      post,
                      activeTab !==
                        "reposts"
                    )
                )}
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}