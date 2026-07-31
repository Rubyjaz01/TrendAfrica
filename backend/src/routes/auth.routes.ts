import { Router } from "express";
import {
  register,
  login,
  me,
  updateUserProfile,
} from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticate, me);
router.put("/profile", authenticate, updateUserProfile);
export default router;
