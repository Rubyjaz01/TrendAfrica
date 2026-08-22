import prisma from "../config/prisma";
import AppError from "../errors/AppError";
import { createNotification } from "./notification.service";

// Follow a user
export async function followUser(
  followerId: number,
  followingId: number
) {
  // Users cannot follow themselves
  if (followerId === followingId) {
    throw new AppError(
      "You cannot follow yourself",
      400
    );
  }

  // Check if the user to follow exists
  const user = await prisma.user.findUnique({
    where: {
      id: followingId,
    },
  });

  if (!user) {
    throw new AppError(
      "User not found",
      404
    );
  }

  // Check if already following
  const existingFollow =
    await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: followerId,
          followingId: followingId,
        },
      },
    });

  if (existingFollow) {
    throw new AppError(
      "You are already following this user",
      400
    );
  }

  // Create follow
  const follow = await prisma.follow.create({
    data: {
      followerId: followerId,
      followingId: followingId,
    },
  });

  // Notify the user being followed
  await createNotification(
    followingId,
    followerId,
    "FOLLOW",
    "Someone started following you."
  );

  return follow;
}

// Unfollow a user
export async function unfollowUser(
  followerId: number,
  followingId: number
) {
  const follow =
    await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: followerId,
          followingId: followingId,
        },
      },
    });

  if (!follow) {
    throw new AppError(
      "You are not following this user",
      404
    );
  }

  await prisma.follow.delete({
    where: {
      followerId_followingId: {
        followerId: followerId,
        followingId: followingId,
      },
    },
  });

  return {
    message: "User unfollowed successfully",
  };
}

// Get followers
export async function getFollowers(
  userId: number
) {
  return prisma.follow.findMany({
    where: {
      followingId: userId,
    },
    include: {
      follower: {
        select: {
          id: true,
          fullName: true,
          username: true,
          avatar: true,
          bio: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

// Get following
export async function getFollowing(
  userId: number
) {
  return prisma.follow.findMany({
    where: {
      followerId: userId,
    },
    include: {
      following: {
        select: {
          id: true,
          fullName: true,
          username: true,
          avatar: true,
          bio: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
// Check if a user is following another user
export async function isFollowing(
  followerId: number,
  followingId: number
) {
  const follow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: followerId,
        followingId: followingId,
      },
    },
  });

  return {
    following: !!follow,
  };
}