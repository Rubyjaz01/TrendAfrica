import prisma from "../config/prisma";

export async function getUserById(
  userId: number
) {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      fullName: true,
      username: true,
      avatar: true,
      bio: true,
      location: true,
      website: true,
      coverImage: true,
      createdAt: true,
    },
  });
}

export async function getUserStats(
  userId: number
) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
    },
  });

  if (!user) {
    return null;
  }

  const [
    posts,
    followers,
    following,
  ] = await Promise.all([
    prisma.post.count({
      where: {
        authorId: userId,
      },
    }),

    prisma.follow.count({
      where: {
        followingId: userId,
      },
    }),

    prisma.follow.count({
      where: {
        followerId: userId,
      },
    }),
  ]);

  return {
    posts,
    followers,
    following,
  };
}

export async function getUserPosts(
  userId: number,
  page: number = 1,
  limit: number = 10
) {
  const safePage =
    Math.max(1, page);

  const safeLimit =
    Math.min(
      Math.max(1, limit),
      50
    );

  const skip =
    (safePage - 1) *
    safeLimit;

  const [
    posts,
    total,
  ] = await Promise.all([
    prisma.post.findMany({
      where: {
        authorId: userId,
      },

      skip,

      take: safeLimit,

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

      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.post.count({
      where: {
        authorId: userId,
      },
    }),
  ]);

  const totalPages =
    Math.ceil(
      total / safeLimit
    );

  return {
    posts,
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