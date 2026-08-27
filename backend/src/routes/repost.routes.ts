import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";

import {
  repost,
  unrepost,
  status,
  count,
  userReposts,
} from "../controllers/repost.controller";

const router = Router();

// Repost a post
router.post(
  "/reposts/:postId",
  authenticate,
  repost
);

// Remove a repost
router.delete(
  "/reposts/:postId",
  authenticate,
  unrepost
);

// Check whether current user reposted a post
router.get(
  "/reposts/:postId/status",
  authenticate,
  status
);

// Get repost count for a post
router.get(
  "/reposts/:postId/count",
  authenticate,
  count
);

// Get posts reposted by a user
router.get(
  "/users/:id/reposts",
  authenticate,
  userReposts
);

export default router;