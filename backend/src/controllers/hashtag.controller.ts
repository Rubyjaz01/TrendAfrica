import { Request, Response } from "express";

import {
  getTrendingHashtags,
  getPostsByHashtag,
} from "../services/hashtag.service";

export async function trending(
  req: Request,
  res: Response
) {
  try {
    const limit = Math.min(
      Number(req.query.limit) || 10,
      50
    );

    const hashtags =
      await getTrendingHashtags(limit);

    return res.status(200).json({
      success: true,
      count: hashtags.length,
      data: hashtags,
    });
  } catch (error: any) {
    console.error(
      "Failed to fetch trending hashtags:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch trending hashtags",
    });
  }
}

export async function getByName(
  req: Request,
  res: Response
) {
  try {
    const name = String(
      req.params.name || ""
    );

    const result =
      await getPostsByHashtag(name);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Hashtag not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error(
      "Failed to fetch hashtag posts:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch hashtag posts",
    });
  }
}