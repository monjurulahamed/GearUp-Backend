// Type augmentation: attach `user` to Express's Request object
// so controllers can safely access `req.user` after checkAuth middleware.

import { Role } from "@prisma/client";

export interface TAuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: "ACTIVE" | "SUSPENDED";
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: TAuthenticatedUser;
    }
  }
}

export {};
