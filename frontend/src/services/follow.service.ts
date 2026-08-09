import api from "../api/api";

export async function followUser(
  followingId: number
) {
  const response = await api.post("/follow", {
    followingId,
  });

  return response.data;
}

export async function unfollowUser(
  followingId: number
) {
  const response = await api.delete(
    `/follow/${followingId}`
  );

  return response.data;
}

export async function getFollowers(
  userId: number
) {
  const response = await api.get(
    `/users/${userId}/followers`
  );

  return response.data;
}

export async function getFollowing(
  userId: number
) {
  const response = await api.get(
    `/users/${userId}/following`
  );

  return response.data;
}
export async function checkFollowing(
  userId: number
) {
  const response = await api.get(
    `/follow/status/${userId}`
  );

  return response.data;
}