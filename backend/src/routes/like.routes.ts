import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { likePost, likeCount } from "../controllers/like.controller";

const router = Router();

// Toggle like/unlike
router.post("/:id/like", authenticate, likePost);

// Get like count
router.get("/:id/likes", likeCount);

export default router;