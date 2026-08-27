import { useEffect, useState } from "react";

import {
  getLikeCount,
  toggleLike,
  checkLike,
} from "../services/like.service";

import {
  createComment,
  getComments,
} from "../services/comment.service";

import {
  updatePost,
  deletePost,
} from "../services/post.service";

import {
  repostPost,
  unrepostPost,
  checkRepost,
  getRepostCount,
} from "../services/repost.service";

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

  onPostDeleted?: (
    postId: number
  ) => void;

  /*
   * Optional recommendation metadata.
   *
   * Home feed does not need to provide this.
   * Explore can provide it.
   */
  recommendationReasons?: string[];
};

export default function PostCard({
  post,
  onPostDeleted,
  recommendationReasons = [],
}: PostCardProps) {
  const [likeCount, setLikeCount] =
    useState(0);

  const [liked, setLiked] =
    useState(false);

  const [liking, setLiking] =
    useState(false);

  const [comments, setComments] =
    useState<Comment[]>([]);

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

  const [editing, setEditing] =
    useState(false);

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

  const [repostCount, setRepostCount] =
    useState(0);

  const [reposted, setReposted] =
    useState(false);

  const [reposting, setReposting] =
    useState(false);

  /*
   * Load like count and current user's
   * like status.
   */
  useEffect(() => {
    async function loadLikeData() {
      try {
        const [
          countResponse,
          statusResponse,
        ] = await Promise.all([
          getLikeCount(post.id),
          checkLike(post.id),
        ]);

        setLikeCount(
          countResponse.data.count
        );

        setLiked(
          statusResponse.data.liked
        );
      } catch (error) {
        console.error(
          "Failed to load like data:",
          error
        );
      }
    }

    loadLikeData();
  }, [post.id]);

  /*
   * Load repost count and current
   * user's repost status.
   */
  useEffect(() => {
    async function loadRepostData() {
      try {
        const [
          countResponse,
          statusResponse,
        ] = await Promise.all([
          getRepostCount(post.id),
          checkRepost(post.id),
        ]);

        setRepostCount(
          countResponse.data.count
        );

        setReposted(
          statusResponse.data.reposted
        );
      } catch (error) {
        console.error(
          "Failed to load repost data:",
          error
        );
      }
    }

    loadRepostData();
  }, [post.id]);

  /*
   * Load current user.
   */
  useEffect(() => {
    async function loadCurrentUser() {
      try {
        const response =
          await getCurrentUser();

        setCurrentUserId(
          response.data.id
        );
      } catch (error) {
        console.error(
          "Failed to load current user:",
          error
        );
      }
    }

    loadCurrentUser();
  }, []);

  /*
   * Load comments.
   */
  async function loadComments() {
    try {
      const response =
        await getComments(post.id);

      setComments(
        response.data
      );
    } catch (error) {
      console.error(
        "Failed to load comments:",
        error
      );
    }
  }

  /*
   * Toggle like.
   */
  async function handleLike() {
    if (liking) return;

    try {
      setLiking(true);

      const response =
        await toggleLike(post.id);

      setLiked(
        response.data.liked
      );

      setLikeCount(
        (currentCount) =>
          response.data.liked
            ? currentCount + 1
            : Math.max(
                0,
                currentCount - 1
              )
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

  /*
   * Toggle repost.
   */
  async function handleRepost() {
    if (reposting) return;

    try {
      setReposting(true);

      if (reposted) {
        await unrepostPost(
          post.id
        );

        setReposted(false);

        setRepostCount(
          (currentCount) =>
            Math.max(
              0,
              currentCount - 1
            )
        );
      } else {
        await repostPost(
          post.id
        );

        setReposted(true);

        setRepostCount(
          (currentCount) =>
            currentCount + 1
        );
      }
    } catch (error: any) {
      console.error(
        "Failed to toggle repost:",
        error
      );

      alert(
        error.response?.data
          ?.message ||
          "Failed to update repost"
      );
    } finally {
      setReposting(false);
    }
  }

  /*
   * Show/hide comments.
   */
  async function handleShowComments() {
    const nextState =
      !showComments;

    setShowComments(
      nextState
    );

    if (nextState) {
      await loadComments();
    }
  }

  /*
   * Submit comment.
   */
  async function handleSubmitComment(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const content =
      commentContent.trim();

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
        error.response?.data
          ?.message ||
          "Failed to create comment"
      );
    } finally {
      setCommentLoading(false);
    }
  }

  /*
   * Save edited post.
   */
  async function handleSaveEdit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const content =
      editContent.trim();

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

      await updatePost(
        post.id,
        {
          content,
          image:
            editImage.trim() ||
            undefined,
        }
      );

      post.content =
        content;

      post.image =
        editImage.trim() ||
        null;

      setEditing(false);
    } catch (error: any) {
      console.error(
        "Failed to update post:",
        error
      );

      setEditError(
        error.response?.data
          ?.message ||
          "Failed to update post"
      );
    } finally {
      setSavingEdit(false);
    }
  }

  /*
   * Delete post.
   */
  async function handleDelete() {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this post?"
      );

    if (!confirmed) return;

    try {
      setDeleting(true);

      await deletePost(
        post.id
      );

      onPostDeleted?.(
        post.id
      );
    } catch (error: any) {
      console.error(
        "Failed to delete post:",
        error
      );

      alert(
        error.response?.data
          ?.message ||
          "Failed to delete post"
      );
    } finally {
      setDeleting(false);
    }
  }

  const isOwner =
    currentUserId !== null &&
    currentUserId ===
      post.author.id;

  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-md">

      {/* Author header */}

      <div className="flex items-start justify-between p-5">

        <div className="flex min-w-0 items-center gap-3">

          {post.author.avatar ? (
            <img
              src={
                post.author.avatar
              }
              alt={
                post.author.fullName
              }
              className="h-11 w-11 shrink-0 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-200 font-bold text-gray-600">
              {post.author.fullName
                .charAt(0)
                .toUpperCase()}
            </div>
          )}

          <div className="min-w-0">

            <p className="truncate font-semibold text-gray-900">
              {
                post.author
                  .fullName
              }
            </p>

            {post.author
              .username && (
              <p className="truncate text-sm text-gray-500">
                @
                {
                  post.author
                    .username
                }
              </p>
            )}

          </div>
        </div>

        {isOwner && (
          <div className="ml-3 flex shrink-0 gap-3">

            <button
              type="button"
              onClick={() =>
                setEditing(
                  (current) =>
                    !current
                )
              }
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              {editing
                ? "Cancel"
                : "Edit"}
            </button>

            <button
              type="button"
              onClick={
                handleDelete
              }
              disabled={
                deleting
              }
              className="text-sm font-medium text-red-600 hover:underline disabled:opacity-50"
            >
              {deleting
                ? "Deleting..."
                : "Delete"}
            </button>

          </div>
        )}

      </div>

      {/* Recommendation reasons */}

      {recommendationReasons.length >
        0 && (
        <div className="px-5 pb-3">

          <div className="flex flex-wrap gap-2">

            {recommendationReasons.map(
              (reason) => (
                <span
                  key={reason}
                  className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                >
                  {reason}
                </span>
              )
            )}

          </div>

        </div>
      )}

      {/* Post content */}

      {editing ? (
        <form
          onSubmit={
            handleSaveEdit
          }
          className="px-5 pb-5"
        >
          <textarea
            value={
              editContent
            }
            onChange={(
              event
            ) =>
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
            value={
              editImage
            }
            onChange={(
              event
            ) =>
              setEditImage(
                event.target.value
              )
            }
            placeholder="Image URL (optional)"
            className="mt-2 w-full rounded-lg border p-3 focus:border-blue-500 focus:outline-none"
          />

          <div className="mt-2 flex items-center justify-between">

            <span className="text-xs text-gray-500">
              {
                editContent.length
              }
              /1000
            </span>

            <button
              type="submit"
              disabled={
                savingEdit
              }
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
        <div className="px-5 pb-5">
          <p className="whitespace-pre-wrap text-gray-800">
            {post.content}
          </p>
        </div>
      )}

      {/* Image */}

      {post.image && (
        <img
          src={post.image}
          alt="Post"
          className="max-h-[600px] w-full object-cover"
        />
      )}

      {/* Interaction bar */}

      <div className="flex flex-wrap items-center gap-5 border-t px-5 py-4">

        <button
          type="button"
          onClick={
            handleLike
          }
          disabled={liking}
          className={`font-medium transition ${
            liked
              ? "text-red-600"
              : "text-gray-600 hover:text-red-600"
          } disabled:opacity-50`}
        >
          {liked
            ? "Liked"
            : "Like"}
        </button>

        <span className="text-sm text-gray-500">
          {likeCount}{" "}
          {likeCount === 1
            ? "Like"
            : "Likes"}
        </span>

        <button
          type="button"
          onClick={
            handleShowComments
          }
          className="font-medium text-gray-600 hover:text-blue-600"
        >
          Comments
        </button>

        <span className="text-sm text-gray-500">
          {comments.length}{" "}
          {comments.length === 1
            ? "Comment"
            : "Comments"}
        </span>

        <button
          type="button"
          onClick={
            handleRepost
          }
          disabled={
            reposting
          }
          className={`font-medium transition ${
            reposted
              ? "text-green-600"
              : "text-gray-600 hover:text-green-600"
          } disabled:opacity-50`}
        >
          {reposting
            ? "Reposting..."
            : reposted
            ? "Reposted"
            : "Repost"}
        </button>

        <span className="text-sm text-gray-500">
          {repostCount}{" "}
          {repostCount === 1
            ? "Repost"
            : "Reposts"}
        </span>

      </div>

      {/* Comments */}

      {showComments && (
        <div className="border-t px-5 py-4">

          <div className="space-y-3">

            {comments.length ===
            0 ? (
              <p className="text-sm text-gray-500">
                No comments yet.
              </p>
            ) : (
              comments.map(
                (comment) => (
                  <div
                    key={
                      comment.id
                    }
                    className="rounded-lg bg-gray-50 p-3"
                  >
                    <p className="font-medium text-gray-900">
                      {
                        comment.user
                          .fullName
                      }
                    </p>

                    {comment.user
                      .username && (
                      <p className="text-xs text-gray-500">
                        @
                        {
                          comment.user
                            .username
                        }
                      </p>
                    )}

                    <p className="mt-1 text-sm text-gray-800">
                      {
                        comment.content
                      }
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {new Date(
                        comment.createdAt
                      ).toLocaleString()}
                    </p>
                  </div>
                )
              )
            )}

          </div>

          <form
            onSubmit={
              handleSubmitComment
            }
            className="mt-4"
          >

            <textarea
              value={
                commentContent
              }
              onChange={(
                event
              ) =>
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
                {
                  commentContent.length
                }
                /500
              </span>

              <button
                type="submit"
                disabled={
                  commentLoading
                }
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

      {/* Timestamp */}

      <p className="border-t px-5 py-3 text-xs text-gray-400">
        {new Date(
          post.createdAt
        ).toLocaleString()}
      </p>

    </article>
  );
}