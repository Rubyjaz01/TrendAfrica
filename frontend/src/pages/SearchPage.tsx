import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  searchUsers,
  searchPosts,
  searchHashtags,
  type SearchUser,
  type SearchPost,
  type SearchHashtag,
} from "../services/search.service";

import FollowButton from "../components/FollowButton";
import PostCard from "../components/PostCard";

type SearchTab =
  | "people"
  | "posts"
  | "hashtags";

export default function SearchPage() {
  const navigate =
    useNavigate();

  const [query, setQuery] =
    useState("");

  const [activeTab, setActiveTab] =
    useState<SearchTab>(
      "people"
    );

  const [users, setUsers] =
    useState<SearchUser[]>(
      []
    );

  const [posts, setPosts] =
    useState<SearchPost[]>(
      []
    );

  const [hashtags, setHashtags] =
    useState<SearchHashtag[]>(
      []
    );

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  function getCurrentUserId():
    number | null {
    try {
      const storedUser =
        localStorage.getItem(
          "user"
        );

      if (!storedUser) {
        return null;
      }

      const user =
        JSON.parse(
          storedUser
        );

      if (
        typeof user.id !==
        "number"
      ) {
        return null;
      }

      return user.id;
    } catch (error) {
      console.error(
        "Failed to read current user:",
        error
      );

      return null;
    }
  }

  function clearResults() {
    setUsers([]);
    setPosts([]);
    setHashtags([]);
  }

  async function handleSearch(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const trimmedQuery =
      query.trim();

    if (!trimmedQuery) {
      clearResults();
      setError(
        "Enter something to search."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      clearResults();

      if (
        activeTab ===
        "people"
      ) {
        const response =
          await searchUsers(
            trimmedQuery
          );

        const currentUserId =
          getCurrentUserId();

        const filteredUsers =
          response.data.filter(
            (
              user: SearchUser
            ) =>
              user.id !==
              currentUserId
          );

        setUsers(
          filteredUsers
        );
      }

      if (
        activeTab ===
        "posts"
      ) {
        const response =
          await searchPosts(
            trimmedQuery
          );

        setPosts(
          response.data || []
        );
      }

      if (
        activeTab ===
        "hashtags"
      ) {
        const response =
          await searchHashtags(
            trimmedQuery
          );

        setHashtags(
          response.data || []
        );
      }
    } catch (error: any) {
      console.error(
        "Search failed:",
        error
      );

      setError(
        error.response?.data
          ?.message ||
          "Search failed"
      );
    } finally {
      setLoading(false);
    }
  }

  function changeTab(
    tab: SearchTab
  ) {
    setActiveTab(tab);
    clearResults();
    setError("");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">

      {/* Search header */}

      <div className="rounded-2xl bg-white p-6 shadow-sm">

        <h1 className="mb-4 text-2xl font-bold text-gray-900">
          Search TrendAfrica
        </h1>

        <form
          onSubmit={
            handleSearch
          }
          className="flex gap-2"
        >
          <input
            type="text"
            value={query}
            onChange={(
              event
            ) =>
              setQuery(
                event.target
                  .value
              )
            }
            placeholder="Search people, posts or hashtags..."
            className="min-w-0 flex-1 rounded-lg border p-3 focus:border-blue-500 focus:outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-600 px-5 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading
              ? "Searching..."
              : "Search"}
          </button>
        </form>

        {/* Tabs */}

        <div className="mt-5 flex border-b">

          <button
            type="button"
            onClick={() =>
              changeTab(
                "people"
              )
            }
            className={`flex-1 border-b-2 px-4 py-3 text-sm font-semibold ${
              activeTab ===
              "people"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            People
          </button>

          <button
            type="button"
            onClick={() =>
              changeTab(
                "posts"
              )
            }
            className={`flex-1 border-b-2 px-4 py-3 text-sm font-semibold ${
              activeTab ===
              "posts"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            Posts
          </button>

          <button
            type="button"
            onClick={() =>
              changeTab(
                "hashtags"
              )
            }
            className={`flex-1 border-b-2 px-4 py-3 text-sm font-semibold ${
              activeTab ===
              "hashtags"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            Hashtags
          </button>

        </div>

        {error && (
          <p className="mt-4 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>

      {/* Results */}

      {activeTab ===
        "people" && (
        <PeopleResults
          users={users}
          loading={loading}
          navigate={navigate}
          query={query}
        />
      )}

      {activeTab ===
        "posts" && (
        <PostResults
          posts={posts}
          loading={loading}
          query={query}
        />
      )}

      {activeTab ===
        "hashtags" && (
        <HashtagResults
          hashtags={
            hashtags
          }
          loading={loading}
          query={query}
          navigate={navigate}
        />
      )}

    </div>
  );
}

function PeopleResults({
  users,
  loading,
  navigate,
  query,
}: {
  users: SearchUser[];
  loading: boolean;
  navigate: (
    path: string
  ) => void;
  query: string;
}) {
  if (loading) {
    return (
      <p className="text-center text-gray-500">
        Searching people...
      </p>
    );
  }

  if (
    users.length === 0
  ) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
        <p className="text-gray-500">
          {query.trim()
            ? "No people found."
            : "Search for a person to get started."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">

      {users.map(
        (user) => (
          <div
            key={user.id}
            className="flex items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-sm"
          >
            <button
              type="button"
              onClick={() =>
                navigate(
                  `/users/${user.id}`
                )
              }
              className="flex min-w-0 flex-1 items-center gap-4 text-left"
            >
              {user.avatar ? (
                <img
                  src={
                    user.avatar
                  }
                  alt={
                    user.fullName
                  }
                  className="h-12 w-12 shrink-0 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-200 font-bold">
                  {user.fullName
                    .charAt(0)
                    .toUpperCase()}
                </div>
              )}

              <div className="min-w-0">

                <p className="truncate font-semibold text-gray-900">
                  {
                    user.fullName
                  }
                </p>

                {user.username && (
                  <p className="truncate text-sm text-gray-500">
                    @
                    {
                      user.username
                    }
                  </p>
                )}

                {user.bio && (
                  <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                    {
                      user.bio
                    }
                  </p>
                )}

              </div>
            </button>

            <div className="shrink-0">
              <FollowButton
                userId={
                  user.id
                }
              />
            </div>
          </div>
        )
      )}

    </div>
  );
}

function PostResults({
  posts,
  loading,
  query,
}: {
  posts: SearchPost[];
  loading: boolean;
  query: string;
}) {
  if (loading) {
    return (
      <p className="text-center text-gray-500">
        Searching posts...
      </p>
    );
  }

  if (
    posts.length === 0
  ) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
        <p className="text-gray-500">
          {query.trim()
            ? "No posts found."
            : "Search for posts to get started."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">

      {posts.map(
        (post) => (
          <PostCard
            key={post.id}
            post={post}
          />
        )
      )}

    </div>
  );
}

function HashtagResults({
  hashtags,
  loading,
  query,
  navigate,
}: {
  hashtags: SearchHashtag[];
  loading: boolean;
  query: string;
  navigate: (
    path: string
  ) => void;
}) {
  if (loading) {
    return (
      <p className="text-center text-gray-500">
        Searching hashtags...
      </p>
    );
  }

  if (
    hashtags.length === 0
  ) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
        <p className="text-gray-500">
          {query.trim()
            ? "No hashtags found."
            : "Search for hashtags to get started."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">

      {hashtags.map(
        (hashtag) => (
          <button
            key={
              hashtag.id
            }
            type="button"
            onClick={() =>
              navigate(
                `/explore/hashtag/${encodeURIComponent(
                  hashtag.name
                )}`
              )
            }
            className="w-full rounded-2xl bg-white p-5 text-left shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-center justify-between">

              <div>
                <p className="text-lg font-bold text-blue-600">
                  #
                  {
                    hashtag.name
                  }
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  {
                    hashtag
                      ._count
                      .posts
                  }{" "}
                  {hashtag
                    ._count
                    .posts ===
                  1
                    ? "post"
                    : "posts"}
                </p>
              </div>

              <span className="text-gray-400">
                →
              </span>

            </div>
          </button>
        )
      )}

    </div>
  );
}