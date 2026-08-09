import { useEffect, useState } from "react";
import {
  getLikeCount,
  toggleLike,
} from "../services/like.service";

type Post = {
  id: number;
  content: string;
  image: string | null;
  createdAt: string;
  author: {
    id: number;
    fullName: string;
    username: string | null;
    avatar: string | null;
  };
};

type PostCardProps = {
  post: Post;
};

export default function PostCard({ post }: PostCardProps) {
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [liking, setLiking] = useState(false);

  useEffect(() => {
    async function loadLikeCount() {
      try {
        const response = await getLikeCount(post.id);

        setLikeCount(response.data.count);
      } catch (error) {
        console.error(
          "Failed to load like count:",
          error
        );
      }
    }

    loadLikeCount();
  }, [post.id]);

  async function handleLike() {
    if (liking) return;

    try {
      setLiking(true);

      const response = await toggleLike(post.id);

      setLiked(response.data.liked);

      setLikeCount((currentCount) =>
        response.data.liked
          ? currentCount + 1
          : Math.max(0, currentCount - 1)
      );
    } catch (error) {
      console.error("Failed to toggle like:", error);
    } finally {
      setLiking(false);
    }
  }

  return (
    <article className="rounded-xl bg-white p-5 shadow">
      <div className="mb-3">
        <p className="font-semibold">
          {post.author.fullName}
        </p>

        {post.author.username && (
          <p className="text-sm text-gray-500">
            @{post.author.username}
          </p>
        )}
      </div>

      <p className="text-gray-800">
        {post.content}
      </p>

      {post.image && (
        <img
          src={post.image}
          alt="Post"
          className="mt-4 w-full rounded-lg"
        />
      )}

      <div className="mt-4 flex items-center gap-4 border-t pt-3">
        <button
          type="button"
          onClick={handleLike}
          disabled={liking}
          className={`font-medium ${
            liked
              ? "text-red-600"
              : "text-gray-600"
          }`}
        >
          {liked ? "♥ Liked" : "♡ Like"}
        </button>

        <span className="text-sm text-gray-500">
          {likeCount}{" "}
          {likeCount === 1 ? "Like" : "Likes"}
        </span>
      </div>

      <p className="mt-3 text-xs text-gray-400">
        {new Date(post.createdAt).toLocaleString()}
      </p>
    </article>
  );
}