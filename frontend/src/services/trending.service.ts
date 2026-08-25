import api from "../api/api";

export async function getTrendingPosts(
  limit: number = 20
) {
  const response = await api.get(
    "/trending",
    {
      params: {
        limit,
      },
    }
  );

  return response.data;
}