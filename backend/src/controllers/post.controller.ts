import { Request, Response } from "express";

import {
  createPostSchema,
  updatePostSchema,
} from "../validators/post.validator";

import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  getFeed,
} from "../services/post.service";

import { uploadPostImage } from "../services/media.service";

export async function create(req: Request, res: Response) {
  try {
    const data = createPostSchema.parse(req.body);

    let image: string | undefined;

    if (req.file) {
      const uploadResult = await uploadPostImage(
        req.file.buffer
      );

      image = uploadResult.image;
    }

    const post = await createPost(
      req.userId!,
      {
        ...data,
        ...(image && { image }),
      }
    );

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: post,
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        errors: error.errors,
      });
    }

    return res.status(500).json({
      success: false,
      message:
        error.message || "Failed to create post",
    });
  }
}

export async function getAll(
  req: Request,
  res: Response
) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await getAllPosts(page, limit);

    return res.status(200).json({
      success: true,

      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
        hasNextPage: result.hasNextPage,
        hasPreviousPage: result.hasPreviousPage,
      },

      count: result.posts.length,
      data: result.posts,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message:
        error.message || "Failed to fetch posts",
    });
  }
}

export async function getOne(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    const post = await getPostById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message:
        error.message || "Failed to fetch post",
    });
  }
}

export async function update(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    const data = updatePostSchema.parse(req.body);

    const post = await updatePost(
      id,
      req.userId!,
      data
    );

    return res.status(200).json({
      success: true,
      message: "Post updated successfully",
      data: post,
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        errors: error.errors,
      });
    }

    if (error.message === "Post not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    if (error.message === "Unauthorized") {
      return res.status(403).json({
        success: false,
        message:
          "You can only edit your own posts.",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function remove(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    const result = await deletePost(
      id,
      req.userId!
    );

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error: any) {
    if (error.message === "Post not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    if (error.message === "Unauthorized") {
      return res.status(403).json({
        success: false,
        message:
          "You can only delete your own posts.",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function feed(
  req: Request,
  res: Response
) {
  try {
    const posts = await getFeed(req.userId!);

    return res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message:
        error.message || "Failed to fetch feed",
    });
  }
}