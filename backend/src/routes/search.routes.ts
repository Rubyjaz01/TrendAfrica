import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware";

import {
  searchUser,
  searchPost,
  searchHashtag,
} from "../controllers/search.controller";

const router = Router();

// Search users
router.get(
  "/search/users",
  authenticate,
  searchUser
);

// Search posts
router.get(
  "/search/posts",
  authenticate,
  searchPost
);

// Search hashtags
router.get(
  "/search/hashtags",
  authenticate,
  searchHashtag
);

export default router;