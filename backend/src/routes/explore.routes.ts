import { Router } from "express";

import {
  authenticate,
} from "../middleware/auth.middleware";

import {
  explore,
} from "../controllers/explore.controller";

const router = Router();

router.get(
  "/explore",
  authenticate,
  explore
);

export default router;