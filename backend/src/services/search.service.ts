import prisma from "../config/prisma";

export async function searchUsers(
  query: string
) {
  return prisma.user.findMany({
    where: {
      OR: [
        {
          fullName: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          username: {
            contains: query,
            mode: "insensitive",
          },
        },
      ],
    },

    select: {
      id: true,
      fullName: true,
      username: true,
      avatar: true,
      bio: true,
    },

    orderBy: {
      fullName: "asc",
    },
  });
}

export async function searchPosts(
  query: string
) {
  return prisma.post.findMany({
    where: {
      OR: [
        {
          content: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          hashtags: {
            some: {
              hashtag: {
                name: {
                  contains: query,
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },

    select: {
      id: true,
      content: true,
      image: true,
      createdAt: true,
      updatedAt: true,
      authorId: true,

      author: {
        select: {
          id: true,
          fullName: true,
          username: true,
          avatar: true,
        },
      },

      _count: {
        select: {
          likes: true,
          comments: true,
          reposts: true,
        },
      },

      hashtags: {
        select: {
          hashtag: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },

    take: 50,
  });
}

export async function searchHashtags(
  query: string
) {
  return prisma.hashtag.findMany({
    where: {
      name: {
        contains: query.replace(
          /^#/,
          ""
        ),
        mode: "insensitive",
      },
    },

    select: {
      id: true,
      name: true,
      createdAt: true,

      _count: {
        select: {
          posts: true,
        },
      },
    },

    orderBy: {
      posts: {
        _count: "desc",
      },
    },

    take: 30,
  });
}