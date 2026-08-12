import { Request, Response } from "express";
import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../services/notification.service";

export async function getAll(
  req: Request,
  res: Response
) {
  try {
    const notifications = await getNotifications(
      req.userId!
    );

    return res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch notifications",
    });
  }
}

export async function unreadCount(
  req: Request,
  res: Response
) {
  try {
    const count =
      await getUnreadNotificationCount(
        req.userId!
      );

    return res.status(200).json({
      success: true,
      data: {
        count,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch unread count",
    });
  }
}

export async function markAsRead(
  req: Request,
  res: Response
) {
  try {
    const notificationId = Number(
      req.params.id
    );

    if (
      !Number.isInteger(notificationId) ||
      notificationId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID",
      });
    }

    const result =
      await markNotificationAsRead(
        req.userId!,
        notificationId
      );

    if (result.count === 0) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Notification marked as read",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to mark notification as read",
    });
  }
}

export async function markAllAsRead(
  req: Request,
  res: Response
) {
  try {
    const result =
      await markAllNotificationsAsRead(
        req.userId!
      );

    return res.status(200).json({
      success: true,
      message:
        "All notifications marked as read",
      data: {
        count: result.count,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to mark notifications as read",
    });
  }
}