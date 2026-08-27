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

export async function getComments(
  postId: number
) {
  const response = await api.get(
    `/posts/${postId}/comments`
  );

  return response.data;
}

export async function updateComment(
  commentId: number,
  content: string
) {
  const response = await api.patch(
    `/comments/${commentId}`,
    {
      content,
    }
  );

  return response.data;
}

export async function deleteComment(
  commentId: number
) {
  const response = await api.delete(
    `/comments/${commentId}`
  );

  return response.data;
}

export async function getCommentCount(
  postId: number
) {
  const response = await api.get(
    `/posts/${postId}/comments/count`
  );

  return response.data;
}