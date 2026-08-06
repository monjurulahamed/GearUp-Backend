import express, {
  type Application,
  type Request,
  type Response,
} from "express";

import cors from "cors";
import { envVars } from "./config/env";
import { prisma } from "./config/prisma";
import { allRoutes } from "../router";
import { notFound } from "./middlewares/notFound";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import cookieParser from "cookie-parser";


const app: Application = express();
app.use(
  cors({
    origin: envVars.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {

  res.status(200).json({
    success: true,
    message: "servet is running",
    version: "1.0.0",
    docs: "/api",
  });
});
app.use("/api", allRoutes);
app.use(notFound);
app.use(globalErrorHandler);

export default app;