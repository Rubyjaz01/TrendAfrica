import api from "../api/api";

export async function getExploreData(
  limit: number = 10
) {
  const response = await api.get(
    "/explore",
    {
      params: {
        limit,
      },
    }
  );

  return response.data;
}