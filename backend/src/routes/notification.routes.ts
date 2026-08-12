import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  getAll,
  unreadCount,
  markAsRead,
  markAllAsRead,
} from "../controllers/notification.controller";

const router = Router();

// Get all notifications
router.get(
  "/notifications",
  authenticate,
  getAll
);

// Get unread notification count
router.get(
  "/notifications/unread-count",
  authenticate,
  unreadCount
);

// Mark one notification as read
router.put(
  "/notifications/:id/read",
  authenticate,
  markAsRead
);

// Mark all notifications as read
router.put(
  "/notifications/read-all",
  authenticate,
  markAllAsRead
);

export default router;