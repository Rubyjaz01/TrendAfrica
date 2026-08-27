import prisma from "../config/prisma";
import AppError from "../errors/AppError";
import {
  CreateCommentInput,
  UpdateCommentInput,
} from "../validators/comment.validator";
import { createNotification } from "./notification.service";

// Create Comment
export async function createComment(
  userId: number,
  postId: number,
  data: CreateCommentInput
) {
  const post =
    await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

  if (!post) {
    throw new AppError(
      "Post not found",
      404
    );
  }

  const comment =
    await prisma.comment.create({
      data: {
        content: data.content,
        userId,
        postId,
      },

      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

  // Do not notify the user about
  // their own comment.
  if (post.authorId !== userId) {
    await createNotification(
      post.authorId,
      userId,
      "COMMENT",
      "Someone commented on your post.",
      postId
    );
  }

  return comment;
}

// Get all comments for a post
export async function getComments(
  postId: number
) {
  return prisma.comment.findMany({
    where: {
      postId,
    },

    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          username: true,
          avatar: true,
        },
      },
    },

    orderBy: {
      createdAt: "asc",
    },
  });
}

// Update a comment
export async function updateComment(
  userId: number,
  commentId: number,
  data: UpdateCommentInput
) {
  const comment =
    await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });

  if (!comment) {
    throw new AppError(
      "Comment not found",
      404
    );
  }

  if (comment.userId !== userId) {
    throw new AppError(
      "You can only edit your own comments",
      403
    );
  }

  return prisma.comment.update({
    where: {
      id: commentId,
    },

    data: {
      content: data.content,
    },

    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          username: true,
          avatar: true,
        },
      },
    },
  });
}

// Delete a comment
export async function deleteComment(
  userId: number,
  commentId: number
) {
  const comment =
    await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });

  if (!comment) {
    throw new AppError(
      "Comment not found",
      404
    );
  }

  if (comment.userId !== userId) {
    throw new AppError(
      "You can only delete your own comments",
      403
    );
  }

  await prisma.comment.delete({
    where: {
      id: commentId,
    },
  });

  return {
    message:
      "Comment deleted successfully",
  };
}

// Get comment count
export async function getCommentCount(
  postId: number
) {
  const count =
    await prisma.comment.count({
      where: {
        postId,
      },
    });

  return {
    count,
  };
}