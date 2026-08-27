import api from "../api/api";

export type SearchUser = {
  id: number;
  fullName: string;
  username: string | null;
  avatar: string | null;
  bio: string | null;
};

export type SearchPost = {
  id: number;
  content: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  authorId: number;

  author: {
    id: number;
    fullName: string;
    username: string | null;
    avatar: string | null;
  };

  _count: {
    likes: number;
    comments: number;
    reposts: number;
  };

  hashtags: {
    hashtag: {
      id: number;
      name: string;
    };
  }[];
};

export type SearchHashtag = {
  id: number;
  name: string;
  createdAt: string;

  _count: {
    posts: number;
  };
};

export async function searchUsers(
  query: string
) {
  const response = await api.get(
    "/search/users",
    {
      params: {
        q: query,
      },
    }
  );

  return response.data;
}

export async function searchPosts(
  query: string
) {
  const response = await api.get(
    "/search/posts",
    {
      params: {
        q: query,
      },
    }
  );

  return response.data;
}

export async function searchHashtags(
  query: string
) {
  const response = await api.get(
    "/search/hashtags",
    {
      params: {
        q: query,
      },
    }
  );

  return response.data;
}