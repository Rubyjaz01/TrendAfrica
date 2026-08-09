import api from "../api/api";

export type PublicUser = {
  id: number;
  fullName: string;
  username: string | null;
  avatar: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  createdAt: string;
};

export async function getUserById(userId: number) {
  const response = await api.get(`/users/${userId}`);

  return response.data;
}