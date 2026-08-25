import api from "../api/api";

export async function getTrendingHashtags(
  limit: number = 10
) {
  const response = await api.get(
    "/hashtags/trending",
    {
      params: {
        limit,
      },
    }
  );

  return response.data;
}

export async function getPostsByHashtag(
  name: string
) {
  const response = await api.get(
    `/hashtags/${encodeURIComponent(name)}`
  );

  return response.data;
}