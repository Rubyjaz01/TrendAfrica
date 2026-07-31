import { Request, Response } from "express";
import { toggleLike, getLikeCount } from "../services/like.service";
import { successResponse } from "../utils/response";
import { asyncHandler } from "../utils/asyncHandler";
import AppError from "../errors/AppError";

export const likePost = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId;

  if (!userId) {
    throw new AppError("Unauthorized", 401);
  }

  const postId = Number(req.params.id);

  const result = await toggleLike(userId, postId);

  return successResponse(res, 200, result.message, {
    liked: result.liked,
  });
});

export const likeCount = asyncHandler(async (req: Request, res: Response) => {
  const postId = Number(req.params.id);

  const result = await getLikeCount(postId);

  return successResponse(
    res,
    200,
    "Like count retrieved successfully",
    result
  );
});