import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  create,
  getAll,
} from "../controllers/comment.controller";

const router = Router();

// Create a comment
router.post("/posts/:id/comments", authenticate, create);

// Get all comments for a post
router.get("/posts/:id/comments", getAll);

export default router;