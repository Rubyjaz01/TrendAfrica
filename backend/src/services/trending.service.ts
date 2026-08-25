import prisma from "../config/prisma";

type TrendingPost = {
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
  trendingScore: number;
};

export async function getTrendingPosts(
  limit: number = 20
): Promise<TrendingPost[]> {
  /*
   * Get recent posts.
   *
   * We intentionally retrieve more posts than the
   * requested limit so that we have enough candidates
   * to rank.
   */
  const posts = await prisma.post.findMany({
    take: 100,
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
          createdAt: true,
        },
      },
      comments: {
        select: {
          createdAt: true,
        },
      },
      reposts: {
        select: {
          createdAt: true,
        },
      },
      
hashtags: {
  include: {
    hashtag: true,
  },
},
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const now = Date.now();

  const rankedPosts: TrendingPost[] =
    posts.map((post) => {
      const likes = post.likes.length;
      const comments = post.comments.length;
      const reposts = post.reposts.length;

      /*
       * Engagement weights:
       *
       * Like    = 1 point
       * Comment = 2 points
       * Repost  = 3 points
       */
      const engagementScore =
        likes +
        comments * 2 +
        reposts * 3;

      /*
       * Calculate post age in hours.
       */
      const ageInHours =
        Math.max(
          0,
          now - post.createdAt.getTime()
        ) /
        (1000 * 60 * 60);

      /*
       * Time decay.
       *
       * The +2 prevents brand-new posts from
       * receiving an excessively large score.
       */
      const trendingScore =
        engagementScore /
        Math.pow(ageInHours + 2, 1.2);

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

        trendingScore: Number(
          trendingScore.toFixed(4)
        ),
      };
    });

  /*
   * Rank highest-scoring posts first.
   */
  rankedPosts.sort(
    (a, b) =>
      b.trendingScore -
      a.trendingScore
  );

  /*
   * Return only the requested number.
   */
  return rankedPosts.slice(0, limit);
}