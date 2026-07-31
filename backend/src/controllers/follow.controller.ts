import { Request, Response } from "express";
import { followUserSchema } from "../validators/follow.validator";
import {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
} from "../services/follow.service";

export async function follow(req: Request, res: Response) {
  try {
    const data = followUserSchema.parse(req.body);

    const result = await followUser(
      req.userId!,
      data.followingId
    );

    return res.status(201).json({
      success: true,
      message: "User followed successfully",
      data: result,
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        errors: error.errors,
      });
    }

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
}
export async function unfollow(req: Request, res: Response) {
  try {
    const followingId = Number(req.params.id);

    const result = await unfollowUser(
      req.userId!,
      followingId
    );

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error: any) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
}
export async function followers(req: Request, res: Response) {
  try {
    const userId = Number(req.params.id);

    const data = await getFollowers(userId);

    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch followers",
    });
  }
}
export async function following(req: Request, res: Response) {
  try {
    const userId = Number(req.params.id);

    const data = await getFollowing(userId);

    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch following",
    });
  }
}