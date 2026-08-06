import bcryptjs from "bcryptjs";
import { Role, User } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { envVars } from "../../config/env";
import { AppError } from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { createToken } from "../../utils/jwt";


const registerUser = async (payload: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  role: "CUSTOMER" | "PROVIDER";
}): Promise<{ user: Omit<User, "password">; token: string }> => {
  const existing = await prisma.user.findUnique({
    where: { email: payload.email },
  });
  if (existing) {
    throw new AppError(
      httpStatus.CONFLICT,
      "Email is already registered. Try logging in."
    );
  }

  const hashedPassword = await bcryptjs.hash(
    payload.password,
    envVars.BCRYPT_SALT_ROUND
  );

  const user = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
      phone: payload.phone,
      address: payload.address,
      role: payload.role as Role,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const token = createToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return { user, token };
};


const loginUser = async (payload: {
  email: string;
  password: string;
}): Promise<{ user: Omit<User, "password">; token: string }> => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });
  if (!user) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Invalid email or password"
    );
  }

  if (user.status === "SUSPENDED") {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Your account is suspended. Please contact admin."
    );
  }

  const isPasswordMatched = await bcryptjs.compare(
    payload.password,
    user.password
  );
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid email or password");
  }

  const token = createToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  
  const { password: _pw, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
};


const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  return user;
};

export const AuthService = {
  registerUser,
  loginUser,
  getMe,
};
