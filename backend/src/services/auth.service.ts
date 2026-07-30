import bcrypt from "bcrypt";
import prisma from "../config/prisma";
import { RegisterInput, LoginInput } from "../validators/auth.validator";
import { generateToken } from "../utils/jwt";

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