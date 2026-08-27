import { useEffect, useState } from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

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

import {
  getFollowers,
  getFollowing,
} from "../services/follow.service";

type ProfileTab =
  | "posts"
  | "media"
  | "reposts";

type FollowUser = {
  id: number;
  fullName: string;
  username: string | null;
  avatar: string | null;
  bio: string | null;
};

type FollowListType =
  | "followers"
  | "following"
  | null;

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

  const [followListType, setFollowListType] =
    useState<FollowListType>(null);

  const [followUsers, setFollowUsers] =
    useState<FollowUser[]>([]);

  const [followListLoading, setFollowListLoading] =
    useState(false);

  const [followListError, setFollowListError] =
    useState("");

  /*
   * Load public user profile
   */
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

  /*
   * Load profile statistics and posts
   */
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

  /*
   * Load reposts only when Reposts tab is opened
   */
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
  }, [
    activeTab,
    id,
    reposts.length,
  ]);

  /*
   * Load followers/following modal
   */
  async function openFollowList(
    type: "followers" | "following"
  ) {
    if (!user) {
      return;
    }

    try {
      setFollowListType(type);
      setFollowListLoading(true);
      setFollowListError("");
      setFollowUsers([]);

      const response =
        type === "followers"
          ? await getFollowers(user.id)
          : await getFollowing(user.id);

      const users: FollowUser[] =
        response.data.map(
          (item: any) =>
            type === "followers"
              ? item.follower
              : item.following
        );

      setFollowUsers(users);
    } catch (error: any) {
      console.error(
        "Failed to load follow list:",
        error
      );

      setFollowListError(
        error.response?.data?.message ||
          `Failed to load ${type}`
      );
    } finally {
      setFollowListLoading(false);
    }
  }

  function closeFollowList() {
    setFollowListType(null);
    setFollowUsers([]);
    setFollowListError("");
  }

  /*
   * Update follower count when
   * the profile owner is followed/unfollowed
   */
  function handleProfileFollowChange(
    following: boolean
  ) {
    setStats((currentStats) =>
      currentStats
        ? {
            ...currentStats,
            followers: following
              ? currentStats.followers + 1
              : Math.max(
                  0,
                  currentStats.followers - 1
                ),
          }
        : currentStats
    );
  }

  /*
   * Remove deleted post from profile
   */
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

  /*
   * Render a post using the existing PostCard
   */
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

  /*
   * Loading state
   */
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

  /*
   * User not found
   */
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
    <>
      <main className="mx-auto max-w-4xl px-4 py-6">

        {/* =========================
            PROFILE HEADER
        ========================== */}

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

          {/* Profile content */}

          <div className="px-5 pb-6 sm:px-7">

            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

              {/* Avatar */}

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

              {/* Follow */}

              <div className="sm:pb-1">
                <FollowButton
                  userId={user.id}
                  onFollowChange={
                    handleProfileFollowChange
                  }
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

              {/* Posts */}

              <div>
                <p className="text-lg font-bold text-gray-900">
                  {stats?.posts ?? 0}
                </p>

                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Posts
                </p>
              </div>

              {/* Followers */}

              <button
                type="button"
                onClick={() =>
                  openFollowList(
                    "followers"
                  )
                }
                className="text-left transition hover:opacity-70"
              >
                <p className="text-lg font-bold text-gray-900">
                  {stats?.followers ?? 0}
                </p>

                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Followers
                </p>
              </button>

              {/* Following */}

              <button
                type="button"
                onClick={() =>
                  openFollowList(
                    "following"
                  )
                }
                className="text-left transition hover:opacity-70"
              >
                <p className="text-lg font-bold text-gray-900">
                  {stats?.following ?? 0}
                </p>

                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Following
                </p>
              </button>

            </div>
          </div>
        </section>

        {/* =========================
            PROFILE TABS
        ========================== */}

        <section className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white">

          <div className="grid grid-cols-3 border-b border-gray-200">

            {/* Posts */}

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

            {/* Media */}

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

            {/* Reposts */}

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

        {/* =========================
            TAB CONTENT
        ========================== */}

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
                    {activeTab ===
                    "posts"
                      ? "No posts yet."
                      : activeTab ===
                        "media"
                      ? "No media posts yet."
                      : "No reposts yet."}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    {activeTab ===
                    "posts"
                      ? "This user hasn't published anything yet."
                      : activeTab ===
                        "media"
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

      {/* =========================
          FOLLOWERS / FOLLOWING MODAL
      ========================== */}

      {followListType && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6"
          onClick={closeFollowList}
        >

          <div
            className="flex max-h-[80vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* Modal Header */}

            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">

              <h2 className="text-lg font-bold text-gray-900">
                {followListType ===
                "followers"
                  ? "Followers"
                  : "Following"}
              </h2>

              <button
                type="button"
                onClick={closeFollowList}
                className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                aria-label="Close"
              >
                ×
              </button>

            </div>

            {/* Modal Content */}

            <div className="overflow-y-auto">

              {followListLoading ? (
                <div className="space-y-4 p-5">

                  <div className="h-16 animate-pulse rounded-xl bg-gray-100" />

                  <div className="h-16 animate-pulse rounded-xl bg-gray-100" />

                  <div className="h-16 animate-pulse rounded-xl bg-gray-100" />

                </div>
              ) : followListError ? (
                <div className="p-8 text-center">

                  <p className="text-sm text-red-600">
                    {followListError}
                  </p>

                </div>
              ) : followUsers.length ===
                0 ? (
                <div className="p-10 text-center">

                  <p className="font-medium text-gray-700">
                    {followListType ===
                    "followers"
                      ? "No followers yet."
                      : "Not following anyone yet."}
                  </p>

                </div>
              ) : (
                <div className="divide-y divide-gray-100">

                  {followUsers.map(
                    (followUser) => (
                      <div
                        key={
                          followUser.id
                        }
                        className="flex items-center gap-3 px-5 py-4 transition hover:bg-gray-50"
                      >

                        {/* Avatar */}

                        <Link
                          to={`/users/${followUser.id}`}
                          onClick={
                            closeFollowList
                          }
                          className="shrink-0"
                        >
                          {followUser.avatar ? (
                            <img
                              src={
                                followUser.avatar
                              }
                              alt={
                                followUser.fullName
                              }
                              className="h-12 w-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-lg font-bold text-gray-600">
                              {followUser.fullName
                                .charAt(
                                  0
                                )
                                .toUpperCase()}
                            </div>
                          )}
                        </Link>

                        {/* User information */}

                        <div className="min-w-0 flex-1">

                          <Link
                            to={`/users/${followUser.id}`}
                            onClick={
                              closeFollowList
                            }
                            className="block truncate font-semibold text-gray-900 hover:underline"
                          >
                            {
                              followUser.fullName
                            }
                          </Link>

                          {followUser.username && (
                            <p className="truncate text-sm text-gray-500">
                              @
                              {
                                followUser.username
                              }
                            </p>
                          )}

                          {followUser.bio && (
                            <p className="mt-1 truncate text-xs text-gray-500">
                              {
                                followUser.bio
                              }
                            </p>
                          )}

                        </div>

                        {/* Follow button */}

                        <FollowButton
                          userId={
                            followUser.id
                          }
                        />

                      </div>
                    )
                  )}

                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </>
  );
}