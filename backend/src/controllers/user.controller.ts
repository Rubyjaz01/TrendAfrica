import { Request, Response } from "express";

import {
  getUserById,
  getUserStats,
  getUserPosts,
} from "../services/user.service";

export async function getMe(
  req: Request,
  res: Response
) {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    console.error(
      "Failed to fetch current user:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch current user",
    });
  }
}

export async function getUser(
  req: Request,
  res: Response
) {
  try {
    const userId = Number(
      req.params.id
    );

    if (
      !Number.isInteger(userId) ||
      userId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const user = await getUserById(
      userId
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch user",
    });
  }
}

export async function getUserStatistics(
  req: Request,
  res: Response
) {
  try {
    const userId = Number(
      req.params.id
    );

    if (
      !Number.isInteger(userId) ||
      userId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const stats =
      await getUserStats(userId);

    if (!stats) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    console.error(
      "Failed to fetch user statistics:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch user statistics",
    });
  }
}

export async function getUserPostList(
  req: Request,
  res: Response
) {
  try {
    const userId = Number(
      req.params.id
    );

    if (
      !Number.isInteger(userId) ||
      userId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const user =
      await getUserById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const page = Number(
      req.query.page || 1
    );

    const limit = Number(
      req.query.limit || 10
    );

    if (
      !Number.isInteger(page) ||
      page <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid page",
      });
    }

    if (
      !Number.isInteger(limit) ||
      limit <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid limit",
      });
    }

    const result =
      await getUserPosts(
        userId,
        page,
        limit
      );

    return res.status(200).json({
      success: true,
      data: result.posts,
      pagination:
        result.pagination,
    });
  } catch (error: any) {
    console.error(
      "Failed to fetch user posts:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch user posts",
    });
  }
}