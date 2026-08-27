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
      coverImage: true,
      bio: true,
      location: true,
      website: true,
      createdAt: true,

      _count: {
        select: {
          posts: true,
          followers: true,
          following: true,
        },
      },

      posts: {
        orderBy: {
          createdAt: "desc",
        },

        take: 20,

        select: {
          id: true,
          content: true,
          image: true,
          createdAt: true,
          updatedAt: true,
          authorId: true,

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
  });
}