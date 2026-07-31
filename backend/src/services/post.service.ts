import prisma from "../config/prisma";
import {
  CreatePostInput,
  UpdatePostInput,
} from "../validators/post.validator";
export async function createPost(
  authorId: number,
  data: CreatePostInput
) {
  return prisma.post.create({
    data: {
      content: data.content,
      image: data.image,
      authorId,
    },
    include: {
      author: {
        select: {
          id: true,
          fullName: true,
          username: true,
        },
      },
    },
  });
}
export async function getAllPosts() {
  return prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: {
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
export async function getPostById(id: number) {
  return prisma.post.findUnique({
    where: {
      id,
    },
    include: {
      author: {
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

export async function updatePost(
  id: number,
  authorId: number,
  data: UpdatePostInput
) {
  const post = await prisma.post.findUnique({
    where: {
      id,
    },
  });

  if (!post) {
    throw new Error("Post not found");
  }

  if (post.authorId !== authorId) {
    throw new Error("Unauthorized");
  }

  return prisma.post.update({
    where: {
      id,
    },
    data: {
      content: data.content,
      image: data.image,
    },
    include: {
      author: {
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
export async function deletePost(
  id: number,
  authorId: number
) {
  const post = await prisma.post.findUnique({
    where: {
      id,
    },
  });

  if (!post) {
    throw new Error("Post not found");
  }

  if (post.authorId !== authorId) {
    throw new Error("Unauthorized");
  }

  await prisma.post.delete({
    where: {
      id,
    },
  });

  return {
    message: "Post deleted successfully",
  };
}