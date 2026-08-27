import prisma from "../config/prisma";
import AppError from "../errors/AppError";
import { createNotification } from "./notification.service";

// Repost a post
export async function repostPost(
  userId: number,
  postId: number
) {
  // Check that the post exists
  const post = await prisma.post.findUnique({
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

  // Check whether the user already reposted it
  const existingRepost =
    await prisma.repost.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

  if (existingRepost) {
    throw new AppError(
      "You have already reposted this post",
      400
    );
  }

  // Create repost
  const repost = await prisma.repost.create({
    data: {
      userId,
      postId,
    },
  });

  // Do not notify the author if they repost
  // their own post.
  if (post.authorId !== userId) {
    await createNotification(
      post.authorId,
      userId,
      "REPOST",
      "Someone reposted your post."
    );
  }

  return repost;
}

// Remove a repost
export async function unrepostPost(
  userId: number,
  postId: number
) {
  const repost =
    await prisma.repost.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

  if (!repost) {
    throw new AppError(
      "You have not reposted this post",
      404
    );
  }

  await prisma.repost.delete({
    where: {
      userId_postId: {
        userId,
        postId,
      },
    },
  });

  return {
    message: "Repost removed successfully",
  };
}

// Check whether a user reposted a post
export async function checkRepost(
  userId: number,
  postId: number
) {
  const repost =
    await prisma.repost.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

  return {
    reposted: !!repost,
  };
}

// Get repost count
export async function getRepostCount(
  postId: number
) {
  return prisma.repost.count({
    where: {
      postId,
    },
  });
}
// Get posts reposted by a user
export async function getUserReposts(
  userId: number,
  page: number = 1,
  limit: number = 10
) {
  const safePage = Math.max(1, page);

  const safeLimit = Math.min(
    Math.max(1, limit),
    50
  );

  const skip =
    (safePage - 1) * safeLimit;

  const [
    reposts,
    total,
  ] = await Promise.all([
    prisma.repost.findMany({
      where: {
        userId,
      },

      skip,

      take: safeLimit,

      include: {
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

            hashtags: {
              include: {
                hashtag: true,
              },
            },
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.repost.count({
      where: {
        userId,
      },
    }),
  ]);

  const totalPages =
    Math.ceil(total / safeLimit);

  return {
    posts: reposts.map(
      (repost) => ({
        ...repost.post,

        feedType: "REPOST" as const,

        repostedBy: {
          id: userId,
        },

        repostedAt:
          repost.createdAt,
      })
    ),

    pagination: {
      total,
      page: safePage,
      limit: safeLimit,
      totalPages,

      hasNextPage:
        safePage < totalPages,

      hasPreviousPage:
        safePage > 1,
    },
  };
}