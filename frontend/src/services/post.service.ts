import api from "../api/api";

export async function getPosts() {
  const response = await api.get("/posts");

  return response.data;
}

export async function getFeed() {
  const response = await api.get("/posts/feed");

  return response.data;
}