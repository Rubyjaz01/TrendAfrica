import { Router } from "express";

import {
  getMe,
  getUser,
  getUserStatistics,
  getUserPostList,
} from "../controllers/user.controller";

import { authenticate } from "../middleware/auth.middleware";

const router = Router();

// Current authenticated user
router.get(
  "/me",
  authenticate,
  getMe
);

// User statistics
// IMPORTANT: This must come before /:id
router.get(
  "/:id/stats",
  authenticate,
  getUserStatistics
);

// User posts
// IMPORTANT: This must come before /:id
router.get(
  "/:id/posts",
  authenticate,
  getUserPostList
);

// Specific user
router.get(
  "/:id",
  authenticate,
  getUser
);

export default router;