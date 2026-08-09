import api from "../api/api";

export type SearchUser = {
  id: number;
  fullName: string;
  username: string | null;
  avatar: string | null;
  bio: string | null;
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