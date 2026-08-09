import api from "../api/api";

export async function createComment(
  postId: number,
  content: string
) {
  const response = await api.post(
    `/posts/${postId}/comments`,
    {
      content,
    }
  );

  return response.data;
}

export async function getComments(postId: number) {
  const response = await api.get(
    `/posts/${postId}/comments`
  );

  return response.data;
}