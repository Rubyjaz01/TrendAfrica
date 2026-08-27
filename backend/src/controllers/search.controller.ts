import {
  Request,
  Response,
} from "express";

import {
  searchUsers,
  searchPosts,
  searchHashtags,
} from "../services/search.service";

function getSearchQuery(
  req: Request,
  res: Response
): string | null {
  const query = String(
    req.query.q || ""
  ).trim();

  if (!query) {
    res.status(400).json({
      success: false,
      message:
        "Search query is required",
    });

    return null;
  }

  return query;
}

export async function searchUser(
  req: Request,
  res: Response
) {
  try {
    const query =
      getSearchQuery(req, res);

    if (query === null) {
      return;
    }

    const users =
      await searchUsers(query);

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error: any) {
    console.error(
      "User search failed:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Search failed",
    });
  }
}

export async function searchPost(
  req: Request,
  res: Response
) {
  try {
    const query =
      getSearchQuery(req, res);

    if (query === null) {
      return;
    }

    const posts =
      await searchPosts(query);

    return res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (error: any) {
    console.error(
      "Post search failed:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Post search failed",
    });
  }
}

export async function searchHashtag(
  req: Request,
  res: Response
) {
  try {
    const query =
      getSearchQuery(req, res);

    if (query === null) {
      return;
    }

    const hashtags =
      await searchHashtags(query);

    return res.status(200).json({
      success: true,
      count: hashtags.length,
      data: hashtags,
    });
  } catch (error: any) {
    console.error(
      "Hashtag search failed:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Hashtag search failed",
    });
  }
}