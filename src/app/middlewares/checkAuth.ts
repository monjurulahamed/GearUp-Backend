import { NextFunction, Request, Response } from "express";
import { Role } from "@prisma/client";


import { AppError } from "../errorHelpers/AppError";
import { verifyToken } from "../utils/jwt";
import { prisma } from "../config/prisma";
import httpStatus from "http-status-codes";






export const checkAuth = (...allowedRoles: Role[]) => {

  return async (req: Request, res: Response, next: NextFunction) => {
    try {

      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          "Authorization token missing. Send header as: Bearer <token>"
        );

      }

      const token = authHeader.split(" ")[1];

      const decoded = verifyToken(token);

   
      
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
        },
      });

      if (!user) {

        throw new AppError(httpStatus.UNAUTHORIZED, "User no longer exists");
      }

      if (user.status === "SUSPENDED") {
        throw new AppError(

          httpStatus.FORBIDDEN,
          "Your account is suspended. Please contact admin."
        );
      }

     
      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        throw new AppError(

          httpStatus.FORBIDDEN,
          `Access denied — requires role: ${allowedRoles.join(" or ")}`
        );
      }

      req.user = user;
      next();

    } catch (err) {
      
      next(err);
    }
  };
};
