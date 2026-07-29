import { Request, Response } from "express";
import { registerSchema } from "../validators/auth.validator";
import { registerUser } from "../services/auth.service";

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