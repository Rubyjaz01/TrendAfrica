import api from "../api/api";

export async function toggleLike(postId: number) {
  const response = await api.post(
    `/likes/${postId}/like`
  );

  return response.data;
}

export async function getLikeCount(postId: number) {
  const response = await api.get(
    `/likes/${postId}/likes`
  );

  return response.data;
}