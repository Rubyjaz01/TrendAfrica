import bcrypt from "bcrypt";
import prisma from "../config/prisma";
import { Request, Response } from "express";
import { RegisterInput, LoginInput } from "../validators/auth.validator";
import { generateToken } from "../utils/jwt";
import { UpdateProfileInput, updateProfileSchema } from "../validators/user.validator";
export async function registerUser(data: RegisterInput) {
  const { fullName, email, password } = data;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },

  });

  if (existingUser) {
    throw new Error("Email already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      fullName,
      email,
      password: hashedPassword,
    },
  });

  // Don't return the password
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}
export async function loginUser(data: LoginInput) {
  const { email, password } = data;

  // Find user by email
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Compare passwords
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw new Error("Invalid email or password");
  }

  // Generate JWT token
  const token = generateToken(user.id);

  return {
    token,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    },
  };
}
export async function getCurrentUser(userId: number) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}
export async function updateProfile(
  userId: number,
  data: UpdateProfileInput
) {
  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data,
    select: {
      id: true,
      fullName: true,
      email: true,
      username: true,
      bio: true,
      avatar: true,
      location: true,
      website: true,
      role: true,
      updatedAt: true,
    },
  });

  return user;
}
export async function updateUserProfile(req: Request, res: Response) {
  try {
    const data = updateProfileSchema.parse(req.body);

    const user = await updateProfile(req.userId!, data);

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}