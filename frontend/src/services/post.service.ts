import api from "../api/api";

export async function getPosts() {
  const response = await api.get("/posts");

  return response.data;
}

export async function getFeed() {
  const response = await api.get("/posts/feed");

  return response.data;
}

type CreatePostData = {
  content: string;
  image?: File | null;
};

export async function createPost(
  data: CreatePostData
) {
  const formData = new FormData();

  formData.append("content", data.content);

  if (data.image) {
    formData.append("image", data.image);
  }

  const response = await api.post(
    "/posts",
    formData
  );

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