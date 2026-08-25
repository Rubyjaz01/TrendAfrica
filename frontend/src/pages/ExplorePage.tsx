import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";

import { getExploreData } from "../services/explore.service";

type RecommendedPost = {
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

  recommendationScore: number;
  recommendationReasons: string[];
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
  trendingPosts: RecommendedPost[];
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
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
          <p className="text-gray-500">
            Loading Explore...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl p-4">
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <p className="font-medium text-red-600">
            {error}
          </p>

          <button
            type="button"
            onClick={loadExplore}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
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
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <p className="text-gray-500">
            No Explore data available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-4">
      {/* Header */}

      <header>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Explore
        </h1>

        <p className="mt-1 text-gray-500">
          Discover what is happening across
          TrendAfrica.
        </p>
      </header>

      {/* Trending Topics */}

      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Trending Topics
          </h2>

          <p className="text-sm text-gray-500">
            What people are talking about
          </p>
        </div>

        {data.trendingHashtags.length ===
        0 ? (
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-gray-500">
              No trending topics yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.trendingHashtags.map(
              (hashtag, index) => (
                <Link
                  key={hashtag.id}
                  to={`/explore/hashtag/${encodeURIComponent(
                    hashtag.name
                  )}`}
                  className="group rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                        #{index + 1} Trending
                      </p>

                      <h3 className="mt-1 text-lg font-bold text-blue-600 group-hover:text-blue-700">
                        #{hashtag.name}
                      </h3>
                    </div>

                    <span className="text-2xl">
                      #
                    </span>
                  </div>

                  <p className="mt-3 text-sm text-gray-500">
                    {hashtag.postCount}{" "}
                    {hashtag.postCount === 1
                      ? "post"
                      : "posts"}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-400">
                    <span>
                      {hashtag.engagement.likes}{" "}
                      likes
                    </span>

                    <span>
                      {hashtag.engagement.comments}{" "}
                      comments
                    </span>

                    <span>
                      {hashtag.engagement.reposts}{" "}
                      reposts
                    </span>
                  </div>
                </Link>
              )
            )}
          </div>
        )}
      </section>

      {/* People to Discover */}

      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            People to Discover
          </h2>

          <p className="text-sm text-gray-500">
            Discover people on TrendAfrica
          </p>
        </div>

        {data.suggestedUsers.length ===
        0 ? (
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-gray-500">
              No people to suggest yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.suggestedUsers.map(
              (user) => (
                <Link
                  key={user.id}
                  to={`/users/${user.id}`}
                  className="rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.fullName}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-lg font-bold text-gray-600">
                        {user.fullName
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="truncate font-semibold text-gray-900">
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

                  <div className="mt-4 flex gap-4 text-xs text-gray-400">
                    <span>
                      {user.stats.posts} posts
                    </span>

                    <span>
                      {user.stats.followers}{" "}
                      followers
                    </span>
                  </div>
                </Link>
              )
            )}
          </div>
        )}
      </section>

      {/* Personalized Explore Feed */}

      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            For You
          </h2>

          <p className="text-sm text-gray-500">
            Posts selected for you by
            TrendAfrica.
          </p>
        </div>

        {data.trendingPosts.length ===
        0 ? (
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-gray-500">
              No recommendations available yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {data.trendingPosts.map(
              (post, index) => (
                <article
                  key={post.id}
                  className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-md"
                >
                  {/* Author */}

                  <div className="flex items-center gap-3 p-5">
                    <Link
                      to={`/users/${post.author.id}`}
                      className="shrink-0"
                    >
                      {post.author.avatar ? (
                        <img
                          src={post.author.avatar}
                          alt={
                            post.author.fullName
                          }
                          className="h-11 w-11 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-200 font-bold text-gray-600">
                          {post.author.fullName
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                      )}
                    </Link>

                    <div className="min-w-0">
                      <Link
                        to={`/users/${post.author.id}`}
                        className="font-semibold text-gray-900 hover:text-blue-600"
                      >
                        {post.author.fullName}
                      </Link>

                      {post.author.username && (
                        <p className="text-sm text-gray-500">
                          @{post.author.username}
                        </p>
                      )}
                    </div>

                    <span className="ml-auto rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500">
                      #{index + 1}
                    </span>
                  </div>

                  {/* Recommendation reason */}

                  {post.recommendationReasons
                    .length > 0 && (
                    <div className="px-5 pb-3">
                      <div className="inline-flex flex-wrap gap-2">
                        {post.recommendationReasons.map(
                          (reason) => (
                            <span
                              key={reason}
                              className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600"
                            >
                              {reason}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Content */}

                  <div className="px-5 pb-5">
                    <p className="whitespace-pre-wrap text-gray-800">
                      {post.content}
                    </p>
                  </div>

                  {/* Image */}

                  {post.image && (
                    <img
                      src={post.image}
                      alt="Post"
                      className="max-h-[600px] w-full object-cover"
                    />
                  )}

                  {/* Engagement */}

                  <div className="flex flex-wrap gap-5 border-t px-5 py-4 text-sm text-gray-500">
                    <span>
                      {post.engagement.likes}{" "}
                      likes
                    </span>

                    <span>
                      {post.engagement.comments}{" "}
                      comments
                    </span>

                    <span>
                      {post.engagement.reposts}{" "}
                      reposts
                    </span>

                    <span className="ml-auto text-xs text-gray-400">
                      {new Date(
                        post.createdAt
                      ).toLocaleString()}
                    </span>
                  </div>
                </article>
              )
            )}
          </div>
        )}
      </section>
    </div>
  );
}