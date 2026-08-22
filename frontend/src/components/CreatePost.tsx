import { useRef, useState } from "react";
import { createPost } from "../services/post.service";

type CreatePostProps = {
  onPostCreated?: () => void;
};

export default function CreatePost({
  onPostCreated,
}: CreatePostProps) {
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function handleImageChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must not exceed 5 MB.");
      return;
    }

    setError("");
    setImage(file);

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
  }

  function removeImage() {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setImage(null);
    setPreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

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
        image,
      });

      setContent("");
      removeImage();

      onPostCreated?.();
    } catch (error: any) {
      console.error("Failed to create post:", error);

      console.error(
        "Status:",
        error.response?.status
      );

      console.error(
        "Response data:",
        error.response?.data
      );

      console.error(
        "Response errors:",
        error.response?.data?.errors
      );

      setError(
        error.response?.data?.message ||
          error.response?.data?.errors?.[0]?.message ||
          error.message ||
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

      <div className="mt-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />

        <button
          type="button"
          onClick={() =>
            fileInputRef.current?.click()
          }
          disabled={loading}
          className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
        >
          📷 Add Image
        </button>
      </div>

      {preview && (
        <div className="relative mt-4 overflow-hidden rounded-lg border">
          <img
            src={preview}
            alt="Selected post"
            className="max-h-80 w-full object-cover"
          />

          <button
            type="button"
            onClick={removeImage}
            disabled={loading}
            className="absolute right-2 top-2 rounded-lg bg-black/70 px-3 py-1 text-sm font-medium text-white hover:bg-black disabled:opacity-50"
          >
            Remove
          </button>
        </div>
      )}

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