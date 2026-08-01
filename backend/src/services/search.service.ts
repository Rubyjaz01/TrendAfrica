import prisma from "../config/prisma";

export async function searchUsers(query: string) {
  return prisma.user.findMany({
    where: {
      OR: [
        {
          fullName: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          username: {
            contains: query,
            mode: "insensitive",
          },
        },
      ],
    },
    select: {
      id: true,
      fullName: true,
      username: true,
      avatar: true,
      bio: true,
    },
    orderBy: {
      fullName: "asc",
    },
  });
}