import api from "../api/api";

export async function getPosts() {
  const response = await api.get("/posts");

  return response.data;
}

export async function getFeed() {
  const response = await api.get("/posts/feed");

  return response.data;
}

export async function createPost(data: {
  content: string;
  image?: string;
}) {
  const response = await api.post("/posts", data);

  return response.data;
}

export async function updatePost(
  postId: number,
  data: {
    content?: string;
    image?: string;
  }
) {
  const response = await api.put(
    `/posts/${postId}`,
    data
  );

  return response.data;
}

export async function deletePost(
  postId: number
) {
  const response = await api.delete(
    `/posts/${postId}`
  );

  return response.data;
}