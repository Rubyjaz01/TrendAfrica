import bcrypt from "bcrypt";
import prisma from "../config/prisma";
import { RegisterInput } from "../validators/auth.validator";

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