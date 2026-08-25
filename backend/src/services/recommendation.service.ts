import prisma from "../config/prisma";
import { getTrendingPosts } from "./trending.service";

type RecommendationUser = {
  followedUserIds: Set<number>;
  interactedPostIds: Set<number>;
  hashtagWeights: Map<string, number>;
};

type RecommendedPost = {
  id: number;
  content: string;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  authorId: number;

  author: {
    id: number;
    fullName: string;
    username: string | null;
    avatar: string | null;
  };

  engagement: {
    likes: number;
    comments: number;
    reposts: number;
  };

  recommendationScore: number;
  recommendationReasons: string[];
};

/*
 * Build the current user's recommendation profile.
 */
async function getRecommendationUser(
  userId: number
): Promise<RecommendationUser> {
  /*
   * Get the user and their interaction history.
   */
  const user =
    await prisma.user.findUnique({
      where: {
        id: userId,
      },

      select: {
        id: true,

        likes: {
          select: {
            postId: true,
            createdAt: true,
          },
        },

        comments: {
          select: {
            postId: true,
            createdAt: true,
          },
        },

        reposts: {
          select: {
            postId: true,
            createdAt: true,
          },
        },
      },
    });

  if (!user) {
    throw new Error("User not found");
  }

  /*
   * Get the users this user actually follows.
   *
   * We query the Follow table directly using
   * followerId to make the relationship explicit.
   */
  const following =
    await prisma.follow.findMany({
      where: {
        followerId: userId,
      },

      select: {
        followingId: true,
      },
    });

  const followedUserIds =
    new Set<number>(
      following.map(
        (follow) =>
          follow.followingId
      )
    );

  /*
   * Store posts the user has interacted with.
   */
  const interactedPostIds =
    new Set<number>();

  /*
   * Store hashtag interest weights.
   */
  const hashtagWeights =
    new Map<string, number>();

  /*
   * Store interaction weights by post.
   */
  const interactionWeights =
    new Map<number, number>();

  /*
   * Register an interaction.
   *
   * Like      = 1
   * Comment   = 2
   * Repost    = 3
   */
  function addInteraction(
    postId: number,
    createdAt: Date,
    baseWeight: number
  ) {
    interactedPostIds.add(
      postId
    );

    /*
     * Recent interactions are stronger.
     */
    const ageHours =
      Math.max(
        0,
        Date.now() -
          createdAt.getTime()
      ) /
      (1000 * 60 * 60);

    const recency =
      1 /
      Math.pow(
        ageHours + 2,
        0.5
      );

    const weightedSignal =
      baseWeight * recency;

    interactionWeights.set(
      postId,
      (interactionWeights.get(
        postId
      ) || 0) + weightedSignal
    );
  }

  /*
   * Process likes.
   */
  for (const like of user.likes) {
    addInteraction(
      like.postId,
      like.createdAt,
      1
    );
  }

  /*
   * Process comments.
   */
  for (const comment of user.comments) {
    addInteraction(
      comment.postId,
      comment.createdAt,
      2
    );
  }

  /*
   * Process reposts.
   */
  for (const repost of user.reposts) {
    addInteraction(
      repost.postId,
      repost.createdAt,
      3
    );
  }

  /*
   * Convert interacted post IDs to an array.
   */
  const interactedPostIdsArray =
    Array.from(
      interactedPostIds
    );

  /*
   * If there is no interaction history,
   * Explore will use the cold-start fallback.
   */
  if (
    interactedPostIdsArray.length === 0
  ) {
    return {
      followedUserIds,
      interactedPostIds,
      hashtagWeights,
    };
  }

  /*
   * Get hashtags from posts the user has
   * interacted with.
   */
  const interactedPosts =
    await prisma.post.findMany({
      where: {
        id: {
          in: interactedPostIdsArray,
        },
      },

      select: {
        id: true,

        hashtags: {
          select: {
            hashtag: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

  /*
   * Build hashtag interest weights.
   */
  for (const post of interactedPosts) {
    const interactionWeight =
      interactionWeights.get(
        post.id
      ) || 0;

    for (const relation of post.hashtags) {
      const hashtagName =
        relation.hashtag.name;

      hashtagWeights.set(
        hashtagName,
        (hashtagWeights.get(
          hashtagName
        ) || 0) +
          interactionWeight
      );
    }
  }

  return {
    followedUserIds,
    interactedPostIds,
    hashtagWeights,
  };
}

/*
 * Calculate freshness.
 */
function calculateFreshnessScore(
  createdAt: Date
): number {
  const ageHours =
    Math.max(
      0,
      Date.now() -
        createdAt.getTime()
    ) /
    (1000 * 60 * 60);

  return Math.min(
    5,
    5 /
      Math.pow(
        ageHours + 2,
        0.75
      )
  );
}

/*
 * Normalize global trending scores.
 */
function normalizeTrendingScores(
  posts: Awaited<
    ReturnType<typeof getTrendingPosts>
  >
): Map<number, number> {
  const scores =
    new Map<number, number>();

  if (posts.length === 0) {
    return scores;
  }

  const maximum =
    Math.max(
      ...posts.map(
        (post) =>
          post.trendingScore
      )
    );

  if (maximum <= 0) {
    return scores;
  }

  for (const post of posts) {
    const normalized =
      (post.trendingScore /
        maximum) *
      10;

    scores.set(
      post.id,
      Math.min(
        10,
        normalized
      )
    );
  }

  return scores;
}

/*
 * Cold-start recommendation results.
 *
 * Used when the user has no interaction
 * history yet.
 */
function createColdStartResults(
  trendingPosts: Awaited<
    ReturnType<typeof getTrendingPosts>
  >,
  limit: number
): RecommendedPost[] {
  return trendingPosts
    .slice(0, limit)
    .map((post) => ({
      id: post.id,
      content: post.content,
      image: post.image,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      authorId: post.authorId,
      author: post.author,

      engagement: {
        likes:
          post.engagement.likes,

        comments:
          post.engagement.comments,

        reposts:
          post.engagement.reposts,
      },

      recommendationScore:
        post.trendingScore,

      recommendationReasons: [
        "Trending on TrendAfrica",
        "Recommended for discovery",
      ],
    }));
}

/*
 * Generate personalized Explore posts.
 */
export async function getPersonalizedPosts(
  userId: number,
  limit: number = 20
): Promise<RecommendedPost[]> {
  /*
   * Protect the requested limit.
   */
  const safeLimit =
    Math.min(
      Math.max(
        Math.floor(limit),
        1
      ),
      50
    );

  /*
   * Build user recommendation profile.
   */
  const user =
    await getRecommendationUser(
      userId
    );

  /*
   * Get globally trending posts.
   */
  const trendingPosts =
    await getTrendingPosts(50);

  /*
   * Cold-start fallback.
   */
  if (
    user.interactedPostIds.size === 0
  ) {
    return createColdStartResults(
      trendingPosts,
      safeLimit
    );
  }

  /*
   * Hashtags the user has shown interest in.
   */
  const interestedHashtags =
    Array.from(
      user.hashtagWeights.keys()
    );

  /*
   * Candidate posts.
   *
   * Candidates can come from:
   *
   * 1. Recent posts
   * 2. Followed users
   * 3. Relevant hashtags
   */
  const candidates =
    await prisma.post.findMany({
      take: 300,

      where: {
        authorId: {
          not: userId,
        },

        OR: [
          /*
           * Recent posts.
           */
          {
            createdAt: {
              gte: new Date(
                Date.now() -
                  7 *
                    24 *
                    60 *
                    60 *
                    1000
              ),
            },
          },

          /*
           * Posts from followed users.
           */
          ...(user.followedUserIds.size > 0
            ? [
                {
                  authorId: {
                    in: Array.from(
                      user.followedUserIds
                    ),
                  },
                },
              ]
            : []),

          /*
           * Posts containing hashtags
           * matching user interests.
           */
          ...(interestedHashtags.length > 0
            ? [
                {
                  hashtags: {
                    some: {
                      hashtag: {
                        name: {
                          in: interestedHashtags,
                        },
                      },
                    },
                  },
                },
              ]
            : []),
        ],
      },

      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            username: true,
            avatar: true,
          },
        },

        likes: {
          select: {
            userId: true,
          },
        },

        comments: {
          select: {
            id: true,
          },
        },

        reposts: {
          select: {
            userId: true,
          },
        },

        hashtags: {
          select: {
            hashtag: {
              select: {
                name: true,
              },
            },
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

  /*
   * Normalize global trending scores.
   */
  const trendingScores =
    normalizeTrendingScores(
      trendingPosts
    );

  /*
   * Rank every candidate.
   */
  const ranked =
    candidates.map((post) => {
      let score = 0;

      const reasons: string[] =
        [];

      /*
       * ---------------------------------
       * FOLLOW SIGNAL
       * ---------------------------------
       *
       * Strong personalization signal.
       */
      if (
        user.followedUserIds.has(
          post.authorId
        )
      ) {
        score += 30;

        reasons.push(
          "From someone you follow"
        );
      }

      /*
       * ---------------------------------
       * HASHTAG INTEREST
       * ---------------------------------
       */
      let hashtagScore = 0;

      for (const relation of post.hashtags) {
        const weight =
          user.hashtagWeights.get(
            relation.hashtag.name
          ) || 0;

        hashtagScore += weight;
      }

      /*
       * Prevent hashtag interest from
       * dominating the entire ranking.
       */
      hashtagScore =
        Math.min(
          20,
          hashtagScore
        );

      if (hashtagScore > 0) {
        score += hashtagScore;

        reasons.push(
          "Matches your interests"
        );
      }

      /*
       * ---------------------------------
       * GLOBAL TRENDING SIGNAL
       * ---------------------------------
       */
      const trendingScore =
        trendingScores.get(
          post.id
        ) || 0;

      score += trendingScore;

      if (trendingScore >= 3) {
        reasons.push(
          "Trending on TrendAfrica"
        );
      }

      /*
       * ---------------------------------
       * FRESHNESS SIGNAL
       * ---------------------------------
       */
      const freshnessScore =
        calculateFreshnessScore(
          post.createdAt
        );

      score += freshnessScore;

      if (
        freshnessScore >= 2
      ) {
        reasons.push(
          "Recently posted"
        );
      }

      /*
       * ---------------------------------
       * ENGAGEMENT QUALITY
       * ---------------------------------
       */
      const likes =
        post.likes.length;

      const comments =
        post.comments.length;

      const reposts =
        post.reposts.length;

      const engagementQuality =
        Math.min(
          5,
          likes * 0.5 +
            comments * 1 +
            reposts * 1.5
        );

      score += engagementQuality;

      /*
       * ---------------------------------
       * FALLBACK REASON
       * ---------------------------------
       *
       * Prevent an empty explanation.
       */
      if (reasons.length === 0) {
        reasons.push(
          "Recommended for discovery"
        );
      }

      return {
        id: post.id,
        content: post.content,
        image: post.image,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        authorId: post.authorId,
        author: post.author,

        engagement: {
          likes,
          comments,
          reposts,
        },

        recommendationScore:
          Number(
            score.toFixed(4)
          ),

        recommendationReasons:
          Array.from(
            new Set(reasons)
          ),
      };
    });

  /*
   * Highest recommendation score first.
   */
  ranked.sort(
    (a, b) =>
      b.recommendationScore -
      a.recommendationScore
  );

  /*
   /*
 * ---------------------------------
 * CREATOR DIVERSITY
 * ---------------------------------
 *
 * Prevent one creator from dominating
 * the Explore page while preserving
 * highly relevant recommendations.
 *
 * Strategy:
 *
 * 1. Always consider posts in score order.
 * 2. Prefer a creator that has not appeared
 *    recently in the selected feed.
 * 3. Allow highly relevant creators to appear
 *    again when necessary.
 * 4. Never allow more than three posts from
 *    the same creator.
 */

const selected: RecommendedPost[] = [];

const authorCounts =
  new Map<number, number>();

/*
 * Number of selections since the same
 * author was last displayed.

/*
 * Maximum number of posts from one
 * creator in a recommendation batch.
 */
const MAX_POSTS_PER_AUTHOR = 3;

/*
 * Minimum number of different creators
 * we try to expose when enough candidates
 * are available.
 */
const TARGET_UNIQUE_CREATORS =
  Math.min(
    safeLimit,
    new Set(
      ranked.map(
        (post) => post.authorId
      )
    ).size
  );

/*
 * First pass:
 *
 * Prefer creators that have not yet appeared.
 */
for (const post of ranked) {
  if (
    selected.length >= safeLimit
  ) {
    break;
  }

  const currentCount =
    authorCounts.get(
      post.authorId
    ) || 0;

  if (
    currentCount >=
    MAX_POSTS_PER_AUTHOR
  ) {
    continue;
  }

  /*
   * During the diversity phase,
   * prioritize creators that have not
   * appeared in the selected feed yet.
   */
  if (
    selected.length <
      TARGET_UNIQUE_CREATORS &&
    currentCount > 0
  ) {
    continue;
  }

  selected.push(post);

  authorCounts.set(
    post.authorId,
    currentCount + 1
  );
}

/*
 * Second pass:
 *
 * Fill any remaining positions using
 * the highest-scoring eligible posts.
 *
 * This ensures strong recommendations
 * are not permanently excluded.
 */
if (
  selected.length <
  safeLimit
) {
  const selectedIds =
    new Set(
      selected.map(
        (post) => post.id
      )
    );

  for (const post of ranked) {
    if (
      selected.length >=
      safeLimit
    ) {
      break;
    }

    if (
      selectedIds.has(post.id)
    ) {
      continue;
    }

    const currentCount =
      authorCounts.get(
        post.authorId
      ) || 0;

    if (
      currentCount >=
      MAX_POSTS_PER_AUTHOR
    ) {
      continue;
    }

    selected.push(post);

    selectedIds.add(post.id);

    authorCounts.set(
      post.authorId,
      currentCount + 1
    );
  }
}

  /*
   * ---------------------------------
   * TRENDING FALLBACK
   * ---------------------------------
   *
   * If personalization does not produce
   * enough results, fill remaining slots
   * with globally trending content.
   */
  if (
    selected.length <
    safeLimit
  ) {
    const selectedIds =
      new Set(
        selected.map(
          (post) => post.id
        )
      );

    for (const post of trendingPosts) {
      if (
        selectedIds.has(
          post.id
        )
      ) {
        continue;
      }

      selected.push({
        id: post.id,
        content: post.content,
        image: post.image,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        authorId: post.authorId,
        author: post.author,

        engagement: {
          likes:
            post.engagement.likes,

          comments:
            post.engagement.comments,

          reposts:
            post.engagement.reposts,
        },

        recommendationScore:
          post.trendingScore,

        recommendationReasons: [
          "Trending on TrendAfrica",
          "Discovery recommendation",
        ],
      });

      if (
        selected.length >=
        safeLimit
      ) {
        break;
      }
    }
  }

  return selected.slice(
    0,
    safeLimit
  );
}