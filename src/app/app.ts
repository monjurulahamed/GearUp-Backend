import express, {
  type Application,
  type Request,
  type Response,
} from "express";

import cors from "cors";
import { envVars } from "./config/env";
import { prisma } from "./config/prisma";


const app: Application = express();
app.use(
  cors({
    origin: envVars.FRONTEND_URL,
    credentials: true,
  })
);


app.get("/", (_req: Request, res: Response) => {
  prisma.
  res.status(200).json({
    success: true,
    message: "servet is running",
    version: "1.0.0",
    docs: "/api/v1",
  });
});


export default app;