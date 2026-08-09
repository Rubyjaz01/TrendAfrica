import { useState } from "react";
import { createPost } from "../services/post.service";

type CreatePostProps = {
  onPostCreated?: () => void;
};

export default function CreatePost({
  onPostCreated,
}: CreatePostProps) {
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!content.trim()) {
      setError("Post content is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await createPost({
        content: content.trim(),
        ...(image.trim() && {
          image: image.trim(),
        }),
      });

      setContent("");
      setImage("");

      onPostCreated?.();
    } catch (error: any) {
      console.error("Failed to create post:", error);

      setError(
        error.response?.data?.message ||
          "Failed to create post"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl bg-white p-5 shadow"
    >
      <h2 className="mb-4 text-lg font-semibold">
        Create a Post
      </h2>

      <textarea
        value={content}
        onChange={(event) =>
          setContent(event.target.value)
        }
        placeholder="What's happening?"
        maxLength={1000}
        rows={4}
        className="w-full rounded-lg border p-3 focus:border-blue-500 focus:outline-none"
      />

      <div className="mt-2 text-right text-sm text-gray-500">
        {content.length}/1000
      </div>

      <input
        type="url"
        value={image}
        onChange={(event) =>
          setImage(event.target.value)
        }
        placeholder="Image URL (optional)"
        className="mt-3 w-full rounded-lg border p-3 focus:border-blue-500 focus:outline-none"
      />

      {error && (
        <p className="mt-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-4 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Posting..." : "Post"}
      </button>
    </form>
  );
}