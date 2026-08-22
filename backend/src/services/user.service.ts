import prisma from "../config/prisma";

export async function getUserById(userId: number) {
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
      createdAt: true,
    },
  });
}