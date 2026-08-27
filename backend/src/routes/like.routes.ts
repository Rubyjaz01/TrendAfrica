import { Router } from "express";

import {
  authenticate,
} from "../middleware/auth.middleware";

import {
  likePost,
  likeCount,
  likeStatus,
} from "../controllers/like.controller";

const router = Router();

// Toggle like / unlike
router.post(
  "/:id/like",
  authenticate,
  likePost
);

// Get like count
router.get(
  "/:id/likes",
  likeCount
);

// Get current user's like status
router.get(
  "/:id/like-status",
  authenticate,
  likeStatus
);

export default router;