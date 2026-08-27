import prisma from "../config/prisma";
import AppError from "../errors/AppError";
import { createNotification } from "./notification.service";

export async function toggleLike(
  userId: number,
  postId: number
) {
  // Ensure the post exists
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  // Check if the user already liked the post
  const existingLike =
    await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

  // Unlike
  if (existingLike) {
    await prisma.like.delete({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    return {
      liked: false,
      message: "Post unliked successfully",
    };
  }

  // Like
  await prisma.like.create({
    data: {
      userId,
      postId,
    },
  });

  // Create notification for the post owner
  // Do not notify the user about their own like.
  if (post.authorId !== userId) {
    await createNotification(
      post.authorId,
      userId,
      "LIKE",
      "Someone liked your post.",
      postId
    );
  }

  return {
    liked: true,
    message: "Post liked successfully",
  };
}

export async function getLikeCount(
  postId: number
) {
  const count = await prisma.like.count({
    where: {
      postId,
    },
  });

  return { count };
}

export async function checkLike(
  userId: number,
  postId: number
) {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    select: {
      id: true,
    },
  });

  if (!post) {
    throw new AppError(
      "Post not found",
      404
    );
  }

  const like =
    await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
      select: {
        userId: true,
      },
    });

  return {
    liked: Boolean(like),
  };
}