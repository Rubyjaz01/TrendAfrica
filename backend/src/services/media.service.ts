import cloudinary from "../config/cloudinary";
import prisma from "../config/prisma";
import AppError from "../errors/AppError";

type ImageUploadResult = {
  url: string;
  publicId: string;
};

async function uploadImage(
  fileBuffer: Buffer,
  folder: string
): Promise<ImageUploadResult> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error || !result) {
          reject(
            new AppError(
              error?.message || "Image upload failed",
              500
            )
          );
          return;
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    uploadStream.end(fileBuffer);
  });
}

export async function uploadAvatar(
  userId: number,
  fileBuffer: Buffer
) {
  if (!fileBuffer || fileBuffer.length === 0) {
    throw new AppError("No image file provided", 400);
  }

  const result = await uploadImage(
    fileBuffer,
    "trendafrica/avatars"
  );

  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      avatar: result.url,
    },
    select: {
      id: true,
      fullName: true,
      username: true,
      avatar: true,
      bio: true,
      location: true,
      website: true,
    },
  });

  return user;
}

export async function uploadCoverImage(
  userId: number,
  fileBuffer: Buffer
) {
  if (!fileBuffer || fileBuffer.length === 0) {
    throw new AppError("No image file provided", 400);
  }

  const result = await uploadImage(
    fileBuffer,
    "trendafrica/covers"
  );

  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      coverImage: result.url,
    },
    select: {
      id: true,
      fullName: true,
      username: true,
      avatar: true,
      coverImage: true,
      bio: true,
      location: true,
      website: true,
    },
  });

  return user;
}