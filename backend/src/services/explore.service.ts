import prisma from "../config/prisma";

import { getPersonalizedPosts } from "./recommendation.service";
import { getTrendingHashtags } from "./hashtag.service";

export async function getExploreData(
  userId: number,
  limit: number = 10
) {
  /*
   * Get personalized posts.
   *
   * The recommendation engine uses:
   *
   * - follows
   * - likes
   * - comments
   * - reposts
   * - hashtag interests
   * - global trending signals
   * - freshness
   * - engagement quality
   *
   * It also contains a cold-start fallback for
   * users who have not interacted with content yet.
   */
  const personalizedPosts =
    await getPersonalizedPosts(
      userId,
      limit
    );

  /*
   * Keep the existing global hashtag
   * discovery system.
   */
  const trendingHashtags =
    await getTrendingHashtags(
      limit
    );

  /*
   * Find users for the "People to Discover"
   * section.
   *
   * This remains intentionally separate from
   * post personalization for now.
   */
  const users =
    await prisma.user.findMany({
      take: 50,

      select: {
        id: true,
        fullName: true,
        username: true,
        avatar: true,
        bio: true,

        _count: {
          select: {
            posts: true,
            followers: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

  /*
   * Remove the currently logged-in user.
   */
  const suggestedUsers = users
    .filter(
      (user) =>
        user.id !== userId
    )
    .map((user) => ({
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      avatar: user.avatar,
      bio: user.bio,

      stats: {
        posts:
          user._count.posts,

        followers:
          user._count.followers,
      },
    }))
    .sort((a, b) => {
      /*
       * Rank users primarily by followers,
       * then by post count.
       *
       * Personalized people recommendations
       * will be a later milestone.
       */
      if (
        b.stats.followers !==
        a.stats.followers
      ) {
        return (
          b.stats.followers -
          a.stats.followers
        );
      }

      return (
        b.stats.posts -
        a.stats.posts
      );
    })
    .slice(0, limit);

  return {
    /*
     * Personalized post discovery.
     */
    trendingPosts:
      personalizedPosts,

    /*
     * Existing trending hashtag engine.
     */
    trendingHashtags,

    /*
     * Existing suggested-user system.
     */
    suggestedUsers,
  };
}