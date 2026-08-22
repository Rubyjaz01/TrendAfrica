import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  follow,
  unfollow,
  followers,
  following,
  checkFollowing,
} from "../controllers/follow.controller";

const router = Router();

// Follow a user
router.post("/follow", authenticate, follow);
router.delete("/follow/:id", authenticate, unfollow);
router.get(
  "/follow/status/:id",
  authenticate,
  checkFollowing
);
router.get("/users/:id/followers", authenticate, followers);
router.get("/users/:id/following", authenticate, following);
export default router;