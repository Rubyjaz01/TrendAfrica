import {
  Request,
  Response,
} from "express";

import {
  createCommentSchema,
  updateCommentSchema,
} from "../validators/comment.validator";

import {
  createComment,
  getComments,
  updateComment,
  deleteComment,
  getCommentCount,
} from "../services/comment.service";

// Create a comment
export async function create(
  req: Request,
  res: Response
) {
  try {
    const postId =
      Number(req.params.id);

    if (
      !Number.isInteger(postId) ||
      postId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID",
      });
    }

    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required",
      });
    }

    const data =
      createCommentSchema.parse(
        req.body
      );

    const comment =
      await createComment(
        req.userId,
        postId,
        data
      );

    return res.status(201).json({
      success: true,
      message:
        "Comment created successfully",
      data: comment,
    });
  } catch (error: any) {
    if (
      error.name === "ZodError"
    ) {
      return res.status(400).json({
        success: false,
        errors: error.errors,
      });
    }

    return res.status(
      error.statusCode || 500
    ).json({
      success: false,
      message:
        error.message ||
        "Failed to create comment",
    });
  }
}

// Get all comments for a post
export async function getAll(
  req: Request,
  res: Response
) {
  try {
    const postId =
      Number(req.params.id);

    if (
      !Number.isInteger(postId) ||
      postId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID",
      });
    }

    const comments =
      await getComments(postId);

    return res.status(200).json({
      success: true,
      count: comments.length,
      data: comments,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch comments",
    });
  }
}

// Update a comment
export async function update(
  req: Request,
  res: Response
) {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required",
      });
    }

    const commentId =
      Number(req.params.commentId);

    if (
      !Number.isInteger(
        commentId
      ) ||
      commentId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid comment ID",
      });
    }

    const data =
      updateCommentSchema.parse(
        req.body
      );

    const comment =
      await updateComment(
        req.userId,
        commentId,
        data
      );

    return res.status(200).json({
      success: true,
      message:
        "Comment updated successfully",
      data: comment,
    });
  } catch (error: any) {
    if (
      error.name === "ZodError"
    ) {
      return res.status(400).json({
        success: false,
        errors: error.errors,
      });
    }

    return res.status(
      error.statusCode || 500
    ).json({
      success: false,
      message:
        error.message ||
        "Failed to update comment",
    });
  }
}

// Delete a comment
export async function remove(
  req: Request,
  res: Response
) {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required",
      });
    }

    const commentId =
      Number(req.params.commentId);

    if (
      !Number.isInteger(
        commentId
      ) ||
      commentId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid comment ID",
      });
    }

    const result =
      await deleteComment(
        req.userId,
        commentId
      );

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error: any) {
    return res.status(
      error.statusCode || 500
    ).json({
      success: false,
      message:
        error.message ||
        "Failed to delete comment",
    });
  }
}

// Get comment count
export async function count(
  req: Request,
  res: Response
) {
  try {
    const postId =
      Number(req.params.id);

    if (
      !Number.isInteger(postId) ||
      postId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID",
      });
    }

    const result =
      await getCommentCount(
        postId
      );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to get comment count",
    });
  }
}