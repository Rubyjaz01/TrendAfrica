import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";

import { getExploreData } from "../services/explore.service";

type TrendingPost = {
  id: number;
  content: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  authorId: number;

  author: {
    id: number;
    fullName: string;
    username: string | null;
    avatar: string | null;
  };

  engagement: {
    likes: number;
    comments: number;
    reposts: number;
  };

  trendingScore: number;
};

type TrendingHashtag = {
  id: number;
  name: string;
  postCount: number;

  engagement: {
    likes: number;
    comments: number;
    reposts: number;
  };

  trendingScore: number;
};

type SuggestedUser = {
  id: number;
  fullName: string;
  username: string | null;
  avatar: string | null;
  bio: string | null;

  stats: {
    posts: number;
    followers: number;
  };
};

type ExploreData = {
  trendingPosts: TrendingPost[];
  trendingHashtags: TrendingHashtag[];
  suggestedUsers: SuggestedUser[];
};

export default function ExplorePage() {
  const [data, setData] =
    useState<ExploreData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadExplore =
    useCallback(async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getExploreData(10);

        console.log(
          "Explore response:",
          response
        );

        setData(response.data);
      } catch (error: any) {
        console.error(
          "Failed to load Explore:",
          error
        );

        setError(
          error?.response?.data?.message ||
            "Failed to load Explore."
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadExplore();
  }, [loadExplore]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl p-4">
        <p className="text-center text-gray-500">
          Loading Explore...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl p-4">
        <div className="rounded-xl bg-white p-6 text-center shadow">
          <p className="text-red-600">
            {error}
          </p>

          <button
            type="button"
            onClick={loadExplore}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-6xl p-4">
        <div className="rounded-xl bg-white p-6 text-center shadow">
          <p className="text-gray-500">
            No Explore data available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4">

      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold">
          Explore
        </h1>

        <p className="mt-1 text-gray-500">
          Discover what's happening across
          TrendAfrica.
        </p>
      </div>

      {/* Trending Hashtags */}

      <section>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">
              Trending Topics
            </h2>

            <p className="text-sm text-gray-500">
              What people are talking about
            </p>
          </div>
        </div>

        {data.trendingHashtags.length ===
        0 ? (
          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-gray-500">
              No trending topics yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {data.trendingHashtags.map(
              (hashtag, index) => (
                <Link
                  key={hashtag.id}
                  to={`/explore/hashtag/${encodeURIComponent(
                    hashtag.name
                  )}`}
                  className="rounded-xl bg-white p-5 shadow transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-start justify-between">

                    <div>
                      <p className="text-sm text-gray-400">
                        #{index + 1} Trending
                      </p>

                      <h3 className="mt-1 text-lg font-bold text-blue-600">
                        #
                        {hashtag.name}
                      </h3>
                    </div>

                    <span className="text-xl">
                      #
                    </span>

                  </div>

                  <p className="mt-3 text-sm text-gray-500">
                    {hashtag.postCount}{" "}
                    {hashtag.postCount ===
                    1
                      ? "post"
                      : "posts"}
                  </p>

                  <div className="mt-3 flex gap-4 text-xs text-gray-400">
                    <span>
                      {hashtag.engagement.likes}{" "}
                      likes
                    </span>

                    <span>
                      {
                        hashtag.engagement
                          .comments
                      }{" "}
                      comments
                    </span>

                    <span>
                      {
                        hashtag.engagement
                          .reposts
                      }{" "}
                      reposts
                    </span>
                  </div>
                </Link>
              )
            )}
          </div>
        )}
      </section>

      {/* Suggested People */}

      <section>
        <div className="mb-3">
          <h2 className="text-xl font-bold">
            People to Discover
          </h2>

          <p className="text-sm text-gray-500">
            Discover people on TrendAfrica
          </p>
        </div>

        {data.suggestedUsers.length ===
        0 ? (
          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-gray-500">
              No people to suggest yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {data.suggestedUsers.map(
              (user) => (
                <Link
                  key={user.id}
                  to={`/users/${user.id}`}
                  className="rounded-xl bg-white p-5 shadow transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-center gap-3">

                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.fullName}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-lg font-bold">
                        {user.fullName
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="truncate font-semibold">
                        {user.fullName}
                      </p>

                      {user.username && (
                        <p className="truncate text-sm text-gray-500">
                          @{user.username}
                        </p>
                      )}
                    </div>

                  </div>

                  {user.bio && (
                    <p className="mt-3 line-clamp-2 text-sm text-gray-600">
                      {user.bio}
                    </p>
                  )}

                  <div className="mt-3 flex gap-4 text-xs text-gray-400">
                    <span>
                      {user.stats.posts}{" "}
                      posts
                    </span>

                    <span>
                      {
                        user.stats.followers
                      }{" "}
                      followers
                    </span>
                  </div>
                </Link>
              )
            )}
          </div>
        )}
      </section>

      {/* Trending Posts */}

      <section>
        <div className="mb-3">
          <h2 className="text-xl font-bold">
            Trending Posts
          </h2>

          <p className="text-sm text-gray-500">
            Posts gaining attention right now
          </p>
        </div>

        {data.trendingPosts.length ===
        0 ? (
          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-gray-500">
              No trending posts yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">

            {data.trendingPosts.map(
              (post, index) => (
                <article
                  key={post.id}
                  className="rounded-xl bg-white p-5 shadow"
                >

                  {/* Author */}

                  <div className="flex items-center gap-3">

                    {post.author.avatar ? (
                      <img
                        src={post.author.avatar}
                        alt={
                          post.author.fullName
                        }
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 font-bold">
                        {post.author.fullName
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                    )}

                    <div>
                      <p className="font-semibold">
                        {
                          post.author
                            .fullName
                        }
                      </p>

                      {post.author
                        .username && (
                        <p className="text-sm text-gray-500">
                          @
                          {
                            post.author
                              .username
                          }
                        </p>
                      )}
                    </div>

                    <span className="ml-auto rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-600">
                      #{index + 1}
                    </span>

                  </div>

                  {/* Content */}

                  <p className="mt-4 whitespace-pre-wrap text-gray-800">
                    {post.content}
                  </p>

                  {/* Image */}

                  {post.image && (
                    <img
                      src={post.image}
                      alt="Post"
                      className="mt-4 max-h-[500px] w-full rounded-lg object-cover"
                    />
                  )}

                  {/* Engagement */}

                  <div className="mt-4 flex flex-wrap gap-5 border-t pt-3 text-sm text-gray-500">

                    <span>
                      ♥{" "}
                      {
                        post.engagement
                          .likes
                      }
                    </span>

                    <span>
                      💬{" "}
                      {
                        post.engagement
                          .comments
                      }
                    </span>

                    <span>
                      ↻{" "}
                      {
                        post.engagement
                          .reposts
                      }
                    </span>

                    <span className="ml-auto font-semibold text-orange-500">
                      Score{" "}
                      {
                        post.trendingScore
                      }
                    </span>

                  </div>

                  {/* Timestamp */}

                  <p className="mt-3 text-xs text-gray-400">
                    {new Date(
                      post.createdAt
                    ).toLocaleString()}
                  </p>

                </article>
              )
            )}

          </div>
        )}
      </section>

    </div>
  );
}