import api from "../api/api";

export type PublicUser = {
  id: number;
  fullName: string;
  username: string | null;
  avatar: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  coverImage: string | null;
  createdAt: string;
};

export type UserStats = {
  posts: number;
  followers: number;
  following: number;
};

export type UserPost = {
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
  hashtags: Array<{
    hashtag: {
      id: number;
      name: string;
    };
  }>;
};

export async function getUserById(
  userId: number
) {
  const response = await api.get(
    `/users/${userId}`
  );

  return response.data;
}

export async function getUserStats(
  userId: number
) {
  const response = await api.get(
    `/users/${userId}/stats`
  );

  return response.data;
}

export async function getUserPosts(
  userId: number,
  page: number = 1,
  limit: number = 10
) {
  const response = await api.get(
    `/users/${userId}/posts`,
    {
      params: {
        page,
        limit,
      },
    }
  );

  return response.data;
}