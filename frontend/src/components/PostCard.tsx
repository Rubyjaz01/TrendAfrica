import { useEffect, useState } from "react";

import {
  getLikeCount,
  toggleLike,
} from "../services/like.service";

import {
  createComment,
  getComments,
} from "../services/comment.service";

import {
  updatePost,
  deletePost,
} from "../services/post.service";

import { getCurrentUser } from "../services/profile.service";

type Comment = {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  postId: number;
  user: {
    id: number;
    fullName: string;
    username: string | null;
    avatar: string | null;
  };
};

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
  onPostDeleted?: (postId: number) => void;
};

export default function PostCard({
  post,
  onPostDeleted,
}: PostCardProps) {
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [liking, setLiking] = useState(false);

  const [comments, setComments] = useState<Comment[]>([]);
  const [commentContent, setCommentContent] =
    useState("");
  const [commentLoading, setCommentLoading] =
    useState(false);
  const [commentError, setCommentError] =
    useState("");
  const [showComments, setShowComments] =
    useState(false);

  const [currentUserId, setCurrentUserId] =
    useState<number | null>(null);

  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] =
    useState(post.content);
  const [editImage, setEditImage] =
    useState(post.image || "");
  const [savingEdit, setSavingEdit] =
    useState(false);
  const [editError, setEditError] =
    useState("");

  const [deleting, setDeleting] =
    useState(false);

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

  useEffect(() => {
    async function loadCurrentUser() {
      try {
        const response = await getCurrentUser();

        setCurrentUserId(response.data.id);
      } catch (error) {
        console.error(
          "Failed to load current user:",
          error
        );
      }
    }

    loadCurrentUser();
  }, []);

  async function loadComments() {
    try {
      const response = await getComments(post.id);

      setComments(response.data);
    } catch (error) {
      console.error(
        "Failed to load comments:",
        error
      );
    }
  }

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
      console.error(
        "Failed to toggle like:",
        error
      );
    } finally {
      setLiking(false);
    }
  }

  async function handleShowComments() {
    const nextState = !showComments;

    setShowComments(nextState);

    if (nextState) {
      await loadComments();
    }
  }

  async function handleSubmitComment(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const content = commentContent.trim();

    if (!content) {
      setCommentError(
        "Comment cannot be empty"
      );
      return;
    }

    if (content.length > 500) {
      setCommentError(
        "Comment cannot exceed 500 characters"
      );
      return;
    }

    try {
      setCommentLoading(true);
      setCommentError("");

      await createComment(
        post.id,
        content
      );

      setCommentContent("");

      await loadComments();

      setShowComments(true);
    } catch (error: any) {
      console.error(
        "Failed to create comment:",
        error
      );

      setCommentError(
        error.response?.data?.message ||
          "Failed to create comment"
      );
    } finally {
      setCommentLoading(false);
    }
  }

  async function handleSaveEdit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const content = editContent.trim();

    if (!content) {
      setEditError(
        "Post content is required"
      );
      return;
    }

    if (content.length > 1000) {
      setEditError(
        "Post cannot exceed 1000 characters"
      );
      return;
    }

    try {
      setSavingEdit(true);
      setEditError("");

      await updatePost(post.id, {
        content,
        image:
          editImage.trim() || undefined,
      });

      post.content = content;
      post.image =
        editImage.trim() || null;

      setEditing(false);
    } catch (error: any) {
      console.error(
        "Failed to update post:",
        error
      );

      setEditError(
        error.response?.data?.message ||
          "Failed to update post"
      );
    } finally {
      setSavingEdit(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmed) return;

    try {
      setDeleting(true);

      await deletePost(post.id);

      onPostDeleted?.(post.id);
    } catch (error: any) {
      console.error(
        "Failed to delete post:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete post"
      );
    } finally {
      setDeleting(false);
    }
  }

  const isOwner =
    currentUserId !== null &&
    currentUserId === post.author.id;

  return (
    <article className="rounded-xl bg-white p-5 shadow">
      <div className="mb-3 flex items-start justify-between">
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

        {isOwner && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() =>
                setEditing((current) => !current)
              }
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              {editing ? "Cancel" : "Edit"}
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="text-sm font-medium text-red-600 hover:underline disabled:opacity-50"
            >
              {deleting
                ? "Deleting..."
                : "Delete"}
            </button>
          </div>
        )}
      </div>

      {editing ? (
        <form
          onSubmit={handleSaveEdit}
          className="mt-3"
        >
          <textarea
            value={editContent}
            onChange={(event) =>
              setEditContent(
                event.target.value
              )
            }
            maxLength={1000}
            rows={4}
            className="w-full rounded-lg border p-3 focus:border-blue-500 focus:outline-none"
          />

          <input
            type="url"
            value={editImage}
            onChange={(event) =>
              setEditImage(event.target.value)
            }
            placeholder="Image URL (optional)"
            className="mt-2 w-full rounded-lg border p-3 focus:border-blue-500 focus:outline-none"
          />

          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {editContent.length}/1000
            </span>

            <button
              type="submit"
              disabled={savingEdit}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {savingEdit
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>

          {editError && (
            <p className="mt-2 text-sm text-red-600">
              {editError}
            </p>
          )}
        </form>
      ) : (
        <p className="text-gray-800">
          {post.content}
        </p>
      )}

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
          {likeCount === 1
            ? "Like"
            : "Likes"}
        </span>

        <button
          type="button"
          onClick={handleShowComments}
          className="font-medium text-gray-600 hover:text-blue-600"
        >
          💬 Comments ({comments.length})
        </button>
      </div>

      {showComments && (
        <div className="mt-4 border-t pt-4">
          <div className="space-y-3">
            {comments.length === 0 ? (
              <p className="text-sm text-gray-500">
                No comments yet.
              </p>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="rounded-lg bg-gray-50 p-3"
                >
                  <p className="font-medium">
                    {comment.user.fullName}
                  </p>

                  {comment.user.username && (
                    <p className="text-xs text-gray-500">
                      @{comment.user.username}
                    </p>
                  )}

                  <p className="mt-1 text-sm text-gray-800">
                    {comment.content}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    {new Date(
                      comment.createdAt
                    ).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>

          <form
            onSubmit={handleSubmitComment}
            className="mt-4"
          >
            <textarea
              value={commentContent}
              onChange={(event) =>
                setCommentContent(
                  event.target.value
                )
              }
              maxLength={500}
              rows={2}
              placeholder="Write a comment..."
              className="w-full rounded-lg border p-3 focus:border-blue-500 focus:outline-none"
            />

            <div className="mt-1 flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {commentContent.length}/500
              </span>

              <button
                type="submit"
                disabled={commentLoading}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {commentLoading
                  ? "Commenting..."
                  : "Comment"}
              </button>
            </div>

            {commentError && (
              <p className="mt-2 text-sm text-red-600">
                {commentError}
              </p>
            )}
          </form>
        </div>
      )}

      <p className="mt-3 text-xs text-gray-400">
        {new Date(
          post.createdAt
        ).toLocaleString()}
      </p>
    </article>
  );
}