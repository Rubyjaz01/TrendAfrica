import { Request, Response } from "express";
import { registerSchema, loginSchema } from "../validators/auth.validator";
import {
  registerUser,
  loginUser,
  getCurrentUser,
  updateProfile,
} from "../services/auth.service";

import { updateProfileSchema } from "../validators/user.validator";

export async function register(req: Request, res: Response) {
  try {
    const data = registerSchema.parse(req.body);

    const user = await registerUser(data);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        errors: error.errors,
      });
    }

    return res.status(400).json({
      success: false,
      message: error.message || "Registration failed",
    });
  }
}
export async function login(req: Request, res: Response) {console.log("Login Request Body:", req.body);
  try {
    const data = loginSchema.parse(req.body);

    const result = await loginUser(data);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        errors: error.errors,
      });
    }

    return res.status(400).json({
      success: false,
      message: error.message || "Login failed",
    });
  }
}
export async function me(req: Request, res: Response) {
  try {
    const user = await getCurrentUser(req.userId!);

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
}
export async function updateUserProfile(req: Request, res: Response) {
  try {
    const data = updateProfileSchema.parse(req.body);

    const user = await updateProfile(req.userId!, data);

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        errors: error.errors,
      });
    }

    return res.status(400).json({
      success: false,
      message: error.message || "Profile update failed",
    });
  }
}