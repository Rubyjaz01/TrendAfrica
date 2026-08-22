import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import upload from "../config/upload";
import {
  uploadUserAvatar,
  uploadUserCover,
} from "../controllers/media.controller";

const router = Router();

router.post(
  "/avatar",
  authenticate,
  upload.single("image"),
  uploadUserAvatar
);

router.post(
  "/cover",
  authenticate,
  upload.single("image"),
  uploadUserCover
);

export default router;