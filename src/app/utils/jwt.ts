import jwt from "jsonwebtoken";
import { envVars } from "../config/env";
import { TAuthenticatedUser } from "../interfaces";


export const createToken = (
  payload: { id: string; email: string; role: string }
): string => {
  return jwt.sign(payload, envVars.JWT_ACCESS_SECRET, {
    expiresIn: envVars.JWT_ACCESS_EXPIRES as any,
  });
};


export const verifyToken = (token: string): TAuthenticatedUser => {
  return jwt.verify(token, envVars.JWT_ACCESS_SECRET) as TAuthenticatedUser;
};
