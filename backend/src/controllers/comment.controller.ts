import { Request, Response } from "express";
import {
  createCommentSchema,
} from "../validators/comment.validator";
import {
  createComment,
  getComments,
} from "../services/comment.service";

// Create a comment
export async function create(req: Request, res: Response) {
  try {
    const postId = Number(req.params.id);

    const data = createCommentSchema.parse(req.body);

    const comment = await createComment(
      req.userId!,
      postId,
      data
    );

    return res.status(201).json({
      success: true,
      message: "Comment created successfully",
      data: comment,
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        errors: error.errors,
      });
    }

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to create comment",
    });
  }
}

// Get all comments for a post
export async function getAll(req: Request, res: Response) {
  try {
    const postId = Number(req.params.id);

    const comments = await getComments(postId);

    return res.status(200).json({
      success: true,
      count: comments.length,
      data: comments,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch comments",
    });
  }
}