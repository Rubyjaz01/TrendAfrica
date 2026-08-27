import { Request, Response } from "express";
import {
  repostPost,
  unrepostPost,
  checkRepost,
  getRepostCount,
  getUserReposts,
} from "../services/repost.service";

export async function repost(
  req: Request,
  res: Response
) {
  try {
    const postId = Number(req.params.postId);

    if (!Number.isInteger(postId) || postId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID",
      });
    }

    const result = await repostPost(
      req.userId!,
      postId
    );

    return res.status(201).json({
      success: true,
      message: "Post reposted successfully",
      data: result,
    });
  } catch (error: any) {
    if (
      error.message === "Post not found"
    ) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    if (
      error.message ===
      "You have already reposted this post"
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to repost post",
    });
  }
}

export async function unrepost(
  req: Request,
  res: Response
) {
  try {
    const postId = Number(req.params.postId);

    if (!Number.isInteger(postId) || postId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID",
      });
    }

    const result = await unrepostPost(
      req.userId!,
      postId
    );

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error: any) {
    if (
      error.message ===
      "You have not reposted this post"
    ) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to remove repost",
    });
  }
}

export async function status(
  req: Request,
  res: Response
) {
  try {
    const postId = Number(req.params.postId);

    if (!Number.isInteger(postId) || postId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID",
      });
    }

    const result = await checkRepost(
      req.userId!,
      postId
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to check repost status",
    });
  }
}

export async function count(
  req: Request,
  res: Response
) {
  try {
    const postId = Number(req.params.postId);

    if (!Number.isInteger(postId) || postId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID",
      });
    }

    const repostCount =
      await getRepostCount(postId);

    return res.status(200).json({
      success: true,
      data: {
        count: repostCount,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to get repost count",
    });
  }
}
// Get posts reposted by a user
export async function userReposts(
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
      await getUserReposts(
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
      "Failed to fetch user reposts:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch user reposts",
    });
  }
}