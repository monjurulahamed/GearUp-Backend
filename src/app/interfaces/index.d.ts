

import { Role } from "@prisma/client";

export interface TAuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: "ACTIVE" | "SUSPENDED";
}

declare global {
  
  namespace Express {
    interface Request {
      user?: TAuthenticatedUser;
    }
  }
}

export {};
