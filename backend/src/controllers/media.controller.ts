import { Request, Response } from "express";
import {
  uploadAvatar,
  uploadCoverImage,
} from "../services/media.service";

type MulterRequest = Request & {
  file?: Express.Multer.File;
};

export async function uploadUserAvatar(
  req: MulterRequest,
  res: Response
) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }

    const user = await uploadAvatar(
      req.userId!,
      req.file.buffer
    );

    return res.status(200).json({
      success: true,
      message: "Profile picture uploaded successfully",
      data: user,
    });
  } catch (error: any) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.message ||
        "Failed to upload profile picture",
    });
  }
}

export async function uploadUserCover(
  req: MulterRequest,
  res: Response
) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }

    const user = await uploadCoverImage(
      req.userId!,
      req.file.buffer
    );

    return res.status(200).json({
      success: true,
      message: "Background picture uploaded successfully",
      data: user,
    });
  } catch (error: any) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.message ||
        "Failed to upload background picture",
    });
  }
}