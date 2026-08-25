import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { trending } from "../controllers/trending.controller";

const router = Router();

router.get(
  "/trending",
  authenticate,
  trending
);

export default router;