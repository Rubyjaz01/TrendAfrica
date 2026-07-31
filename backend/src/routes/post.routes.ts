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
router.get("/", getAll);

router.post("/", authenticate, create);
router.put("/:id", authenticate, update);
router.delete("/:id", authenticate, remove);

export default router;
router.get("/", getAll);
router.get("/feed", authenticate, feed);
router.get("/:id", getOne);

router.post("/", authenticate, create);