import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { searchUser } from "../controllers/search.controller";

const router = Router();

// Search users
router.get("/search/users", authenticate, searchUser);

export default router;