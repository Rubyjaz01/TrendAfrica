import prisma from "../config/prisma";

export async function createNotification(
  recipientId: number,
  actorId: number,
  type: string,
  message: string,
  postId?: number
) {
  // Do not notify users about their own actions
  if (recipientId === actorId) {
    return null;
  }

  return prisma.notification.create({
    data: {
      recipientId,
      actorId,
      type,
      message,
      postId,
    },
  });
}

export async function getNotifications(
  userId: number
) {
  return prisma.notification.findMany({
    where: {
      recipientId: userId,
    },
    include: {
      actor: {
        select: {
          id: true,
          fullName: true,
          username: true,
          avatar: true,
        },
      },
      post: {
        select: {
          id: true,
          content: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getUnreadNotificationCount(
  userId: number
) {
  return prisma.notification.count({
    where: {
      recipientId: userId,
      read: false,
    },
  });
}

export async function markNotificationAsRead(
  userId: number,
  notificationId: number
) {
  return prisma.notification.updateMany({
    where: {
      id: notificationId,
      recipientId: userId,
    },
    data: {
      read: true,
    },
  });
}

export async function markAllNotificationsAsRead(
  userId: number
) {
  return prisma.notification.updateMany({
    where: {
      recipientId: userId,
      read: false,
    },
    data: {
      read: true,
    },
  });
}