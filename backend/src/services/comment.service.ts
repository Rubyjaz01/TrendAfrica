import prisma from "../config/prisma";
import AppError from "../errors/AppError";
import {
  CreateCommentInput,
  UpdateCommentInput,
} from "../validators/comment.validator";

// Create Comment
export async function createComment(
  userId: number,
  postId: number,
  data: CreateCommentInput
) {
  // Check if post exists
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  return prisma.comment.create({
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
}

// Get all comments for a post
export async function getComments(postId: number) {
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