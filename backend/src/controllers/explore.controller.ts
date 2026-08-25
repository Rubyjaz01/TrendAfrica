import {
  Request,
  Response,
} from "express";

import {
  getExploreData,
} from "../services/explore.service";

export async function explore(
  req: Request,
  res: Response
) {
  try {
    const requestedLimit =
      Number(req.query.limit);

    const limit =
      Number.isFinite(
        requestedLimit
      ) &&
      requestedLimit > 0
        ? Math.min(
            Math.floor(
              requestedLimit
            ),
            20
          )
        : 10;

    const userId =
      req.userId!;
console.log(
  "EXPLORE AUTH USER ID:",
  userId
);
    const data =
      await getExploreData(
        userId,
        limit
      );

    return res.status(200).json({
      success: true,

      data: {
        trendingPosts:
          data.trendingPosts,

        trendingHashtags:
          data.trendingHashtags,

        suggestedUsers:
          data.suggestedUsers,
      },
    });
  } catch (error: any) {
    console.error(
      "Failed to fetch explore data:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch explore data",
    });
  }
}
