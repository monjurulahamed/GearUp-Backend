
import httpStatus from "http-status-codes";


import { prisma } from "../../config/prisma";

import { AppError } from "../../errorHelpers/AppError";


const updateMyProfile = async (
  userId: string,
  payload: { name?: string; phone?: string; address?: string }
) => {
  const updated = await prisma.user.update({
    where: { id: userId },
    data: payload,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      role: true,
      status: true,
      updatedAt: true,
    },
  });
  return updated;
};




const updateUserStatus = async (
  userId: string,
  status: "ACTIVE" | "SUSPENDED") => {
  const existing = await prisma.user.findUnique({ where: { id: userId } });
  if (!existing) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  if (existing.role === "ADMIN") {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Admin user status cannot be changed"
    );
  }
  const updated = await prisma.user.update({
    where: { id: userId },
    data: { status },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      updatedAt: true,
    },
  });
  return updated;
};

export const UserService = {
  updateMyProfile,
  updateUserStatus,
};
