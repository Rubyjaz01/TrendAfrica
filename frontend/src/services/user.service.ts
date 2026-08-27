import api from "../api/api";

export type PublicUserPost = {
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
};

export type PublicUser = {
  id: number;
  fullName: string;
  username: string | null;
  avatar: string | null;
  coverImage: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  createdAt: string;

  _count: {
    posts: number;
    followers: number;
    following: number;
  };

  posts: PublicUserPost[];
};

export async function getUserById(
  userId: number
) {
  const response = await api.get(
    `/users/${userId}`
  );

  return response.data;
}