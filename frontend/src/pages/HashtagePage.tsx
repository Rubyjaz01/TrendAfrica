import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getPostsByHashtag } from "../services/hashtag.service";

type HashtagPost = {
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

  hashtags?: {
    hashtag: {
      id: number;
      name: string;
    };
  }[];
};

type HashtagResponse = {
  id: number;
  name: string;
  postCount: number;
  posts: HashtagPost[];
};

export default function HashtagPage() {
  const { name } = useParams<{
    name: string;
  }>();

  const [result, setResult] =
    useState<HashtagResponse | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadHashtag = useCallback(
    async () => {
      if (!name) {
        setError("Hashtag not found.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response =
          await getPostsByHashtag(name);

        console.log(
          "Hashtag response:",
          response
        );

        setResult(response.data);
      } catch (error: any) {
        console.error(
          "Failed to load hashtag:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load hashtag."
        );
      } finally {
        setLoading(false);
      }
    },
    [name]
  );

  useEffect(() => {
    loadHashtag();
  }, [loadHashtag]);

  if (loading) {
    return (
      <p className="text-center">
        Loading hashtag...
      </p>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl">
        <p className="text-center text-red-600">
          {error}
        </p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="mx-auto max-w-2xl">
        <p className="text-center text-gray-500">
          Hashtag not found.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      {/* Header */}

      <div className="rounded-xl bg-white p-6 shadow">
        <p className="text-sm text-gray-500">
          TrendAfrica Topic
        </p>

        <h1 className="mt-1 text-3xl font-bold">
          #{result.name}
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          {result.postCount}{" "}
          {result.postCount === 1
            ? "post"
            : "posts"}
        </p>
      </div>

      {/* Posts */}

      {result.posts.length === 0 ? (
        <div className="rounded-xl bg-white p-6 text-center shadow">
          <p className="text-gray-500">
            No posts found for this hashtag.
          </p>
        </div>
      ) : (
        result.posts.map((post) => (
          <article
            key={post.id}
            className="rounded-xl bg-white p-5 shadow"
          >
            {/* Author */}

            <div className="mb-3 flex items-center gap-3">
              {post.author.avatar ? (
                <img
                  src={post.author.avatar}
                  alt={post.author.fullName}
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
                  {post.author.fullName}
                </p>

                {post.author.username && (
                  <p className="text-sm text-gray-500">
                    @{post.author.username}
                  </p>
                )}
              </div>
            </div>

            {/* Content */}

            <p className="whitespace-pre-wrap text-gray-800">
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

            {/* Hashtags */}

            {post.hashtags &&
              post.hashtags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.hashtags.map(
                    ({ hashtag }) => (
                      <Link
                        key={hashtag.id}
                        to={`/explore/hashtag/${encodeURIComponent(
                          hashtag.name
                        )}`}
                        className="text-sm font-medium text-blue-600 hover:underline"
                      >
                        #{hashtag.name}
                      </Link>
                    )
                  )}
                </div>
              )}

            {/* Date */}

            <p className="mt-4 text-xs text-gray-400">
              {new Date(
                post.createdAt
              ).toLocaleString()}
            </p>
          </article>
        ))
      )}
    </div>
  );
}