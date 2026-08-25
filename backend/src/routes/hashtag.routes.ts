import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware";

import {
  trending,
  getByName,
} from "../controllers/hashtag.controller";

const router = Router();

router.get(
  "/hashtags/trending",
  authenticate,
  trending
);

router.get(
  "/hashtags/:name",
  authenticate,
  getByName
);

export default router;