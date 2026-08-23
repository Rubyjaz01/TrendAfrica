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
  const following =
    await prisma.follow.findMany({
      where: {
        followerId: userId,
      },
      select: {
        followingId: true,
      },
    });

  const followingIds: number[] =
    following.map(
      (follow) => follow.followingId
    );

  /*
   * If the user follows nobody,
   * show the latest public posts.
   */
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

  /*
   * Include the current user's own posts
   * and posts from followed users.
   */
  const feedAuthorIds = [
    userId,
    ...followingIds,
  ];

  /*
   * Get original posts.
   */
  const posts = await prisma.post.findMany({
    where: {
      authorId: {
        in: feedAuthorIds,
      },
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
    orderBy: {
      createdAt: "desc",
    },
  });

  /*
   * Get reposts made by followed users.
   */
  const reposts = await prisma.repost.findMany({
    where: {
      userId: {
        in: followingIds,
      },
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
      post: {
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
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  type FeedUser = {
    id: number;
    fullName: string;
    username: string | null;
    avatar: string | null;
  };

  type FeedItem = {
    id: number;
    content: string;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
    authorId: number;

    author: FeedUser;

    feedType: "POST" | "REPOST";

    repostedBy: FeedUser | null;

    repostedAt: Date | null;
  };

  /*
   * Store exactly ONE feed item
   * for each unique post.
   */
  const feedMap = new Map<
    number,
    FeedItem
  >();

  /*
   * Add original posts.
   */
  for (const post of posts) {
    feedMap.set(post.id, {
      ...post,
      feedType: "POST",
      repostedBy: null,
      repostedAt: null,
    });
  }

  /*
   * Add reposts.
   *
   * If a repost is newer than the original
   * feed event, replace the existing item.
   */
  for (const repost of reposts) {
    const postId = repost.post.id;

    const existing =
      feedMap.get(postId);

    const repostTime =
      repost.createdAt.getTime();

    if (!existing) {
      feedMap.set(postId, {
        ...repost.post,
        feedType: "REPOST",
        repostedBy: repost.user,
        repostedAt: repost.createdAt,
      });

      continue;
    }

    const existingTime = new Date(
      existing.repostedAt ||
        existing.createdAt
    ).getTime();

    if (repostTime > existingTime) {
      feedMap.set(postId, {
        ...repost.post,
        feedType: "REPOST",
        repostedBy: repost.user,
        repostedAt: repost.createdAt,
      });
    }
  }

  /*
   * Convert the Map to an array.
   */
  const feedItems = Array.from(
    feedMap.values()
  );

  /*
   * Sort by the newest feed event.
   */
  feedItems.sort((a, b) => {
    const dateA = new Date(
      a.repostedAt || a.createdAt
    ).getTime();

    const dateB = new Date(
      b.repostedAt || b.createdAt
    ).getTime();

    return dateB - dateA;
  });

  /*
   * Return the 20 newest unique posts.
   */
  return feedItems.slice(0, 20);
}