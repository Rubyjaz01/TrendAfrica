import prisma from "../config/prisma";
import {
  getPagination,
  getPaginationMeta,
} from "../utils/pagination";
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

export async function getAllPosts(
  page: number = 1,
  limit: number = 10
) {
  const { skip, take } = getPagination(
    page,
    limit
  );

  const posts = await prisma.post.findMany({
    skip,
    take,
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
    orderBy: {
      createdAt: "desc",
    },
  });

  const total = await prisma.post.count();

  const pagination = getPaginationMeta(
    total,
    page,
    limit
  );

  return {
    ...pagination,
    posts,
  };
}

export async function getPostById(
  id: number
) {
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

export async function getFeed(
  userId: number
) {
  const following = await prisma.follow.findMany({
    where: {
      followerId: userId,
    },
    select: {
      followingId: true,
    },
  });

  const followingIds = following.map(
    (follow) => follow.followingId
  );

  // If the user follows nobody,
  // show the latest public posts.
  if (followingIds.length === 0) {
    return prisma.post.findMany({
      take: 20,
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
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // Include the current user's own posts
  // together with posts from followed users.
  const feedAuthorIds = [
    userId,
    ...followingIds,
  ];

  return prisma.post.findMany({
    where: {
      authorId: {
        in: feedAuthorIds,
      },
    },
    take: 20,
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
    orderBy: {
      createdAt: "desc",
    },
  });
}