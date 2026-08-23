import api from "../api/api";

export async function repostPost(
  postId: number
) {
  const response = await api.post(
    `/reposts/${postId}`
  );

  return response.data;
}

export async function unrepostPost(
  postId: number
) {
  const response = await api.delete(
    `/reposts/${postId}`
  );

  return response.data;
}

export async function checkRepost(
  postId: number
) {
  const response = await api.get(
    `/reposts/${postId}/status`
  );

  return response.data;
}

export async function getRepostCount(
  postId: number
) {
  const response = await api.get(
    `/reposts/${postId}/count`
  );

  return response.data;
}