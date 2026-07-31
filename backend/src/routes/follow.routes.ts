import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  follow,
  unfollow,
} from "../controllers/follow.controller";

const router = Router();

// Follow a user
router.post("/follow", authenticate, follow);
router.delete("/follow/:id", authenticate, unfollow);
export default router;