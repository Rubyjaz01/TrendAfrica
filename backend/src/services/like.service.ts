import prisma from "../config/prisma";
import AppError from "../errors/AppError";

export async function toggleLike(userId: number, postId: number) {
  // Ensure the post exists
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  // Check if the user already liked the post
  const existingLike = await prisma.like.findUnique({
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

  return {
    liked: true,
    message: "Post liked successfully",
  };
}

export async function getLikeCount(postId: number) {
  const count = await prisma.like.count({
    where: {
      postId,
    },
  });

  return { count };
}