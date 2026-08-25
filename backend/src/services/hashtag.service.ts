import prisma from "../config/prisma";

export async function getTrendingHashtags(
  limit: number = 10
) {
  const hashtags =
    await prisma.hashtag.findMany({
      include: {
        posts: {
          include: {
            post: {
              include: {
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
              },
            },
          },
        },
      },
    });

  const now = Date.now();

  const results = hashtags.map(
    (hashtag) => {
      let postCount = 0;
      let likes = 0;
      let comments = 0;
      let reposts = 0;
      let score = 0;

      for (const relation of hashtag.posts) {
        postCount++;

        const post = relation.post;

        likes += post.likes.length;
        comments += post.comments.length;
        reposts += post.reposts.length;

        const ageHours = Math.max(
          1,
          (now - post.createdAt.getTime()) /
            (1000 * 60 * 60)
        );

        const recency =
          1 / Math.pow(ageHours, 0.75);

        const engagement =
          post.likes.length +
          post.comments.length * 2 +
          post.reposts.length * 3;

        score +=
          engagement * recency +
          recency;
      }

      return {
        id: hashtag.id,
        name: hashtag.name,
        postCount,
        engagement: {
          likes,
          comments,
          reposts,
        },
        trendingScore: Number(
          score.toFixed(4)
        ),
      };
    }
  );

  return results
    .filter(
      (hashtag) =>
        hashtag.postCount > 0
    )
    .sort(
      (a, b) =>
        b.trendingScore -
        a.trendingScore
    )
    .slice(0, limit);
}

export async function getPostsByHashtag(
  name: string
) {
  const normalizedName = name
    .trim()
    .replace(/^#/, "")
    .toLowerCase();

  if (!normalizedName) {
    throw new Error(
      "Hashtag name is required"
    );
  }

  const hashtag =
    await prisma.hashtag.findUnique({
      where: {
        name: normalizedName,
      },
      include: {
        posts: {
          include: {
            post: {
              include: {
                author: {
                  select: {
                    id: true,
                    fullName: true,
                    username: true,
                    avatar: true,
                  },
                },
                hashtags: {
                  include: {
                    hashtag: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

  if (!hashtag) {
    return null;
  }

  return {
    id: hashtag.id,
    name: hashtag.name,
    postCount: hashtag.posts.length,
    posts: hashtag.posts.map(
      (relation) => relation.post
    ),
  };
}