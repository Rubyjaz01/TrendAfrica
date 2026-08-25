import { Request, Response } from "express";
import { getTrendingPosts } from "../services/trending.service";

export async function trending(
  req: Request,
  res: Response
) {
  try {
    const requestedLimit = Number(
      req.query.limit
    );

    const limit =
      Number.isFinite(requestedLimit) &&
      requestedLimit > 0
        ? Math.min(
            Math.floor(requestedLimit),
            50
          )
        : 20;

    const posts =
      await getTrendingPosts(limit);

    return res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (error: any) {
    console.error(
      "Failed to fetch trending posts:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch trending posts",
    });
  }
}