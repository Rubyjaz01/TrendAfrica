import { Router } from "express";

import {
  authenticate,
} from "../middleware/auth.middleware";

import {
  create,
  getAll,
  update,
  remove,
  count,
} from "../controllers/comment.controller";

const router = Router();

// Create a comment
router.post(
  "/posts/:id/comments",
  authenticate,
  create
);

// Get all comments
router.get(
  "/posts/:id/comments",
  getAll
);

// Get comment count
router.get(
  "/posts/:id/comments/count",
  count
);

// Update a comment
router.patch(
  "/comments/:commentId",
  authenticate,
  update
);

// Delete a comment
router.delete(
  "/comments/:commentId",
  authenticate,
  remove
);

export default router;