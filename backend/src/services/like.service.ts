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
          userId: userId,
          postId: postId,
        },
      },
    });

  // Unlike
  if (existingLike) {
    await prisma.like.delete({
      where: {
        userId_postId: {
          userId: userId,
          postId: postId,
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
      userId: userId,
      postId: postId,
    },
  });

  // Create notification for the post owner
  await createNotification(
    post.authorId,
    userId,
    "LIKE",
    "Someone liked your post.",
    postId
  );

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
      postId: postId,
    },
  });

  return { count };
}