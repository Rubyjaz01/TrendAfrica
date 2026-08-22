import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";

import {
  create,
  getAll,
  getOne,
  update,
  remove,
  feed,
} from "../controllers/post.controller";

const router = Router();

// Get all posts
router.get("/", getAll);

// Get personalized feed
router.get("/feed", authenticate, feed);

// Get one post
router.get("/:id", getOne);

// Create post
router.post("/", authenticate, create);

// Update post
router.put("/:id", authenticate, update);

// Delete post
router.delete("/:id", authenticate, remove);

export default router;