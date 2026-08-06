import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

interface EnvConfig {
  PORT: number;
  DATABASE_URL: string;
  NODE_ENV: "development" | "production";
  SUPER_ADMIN_EMAIL: string;
  SUPER_ADMIN_PASSWORD: string;
  JWT_ACCESS_SECRET: string;
  JWT_ACCESS_EXPIRES: string;
  BCRYPT_SALT_ROUND: number;
  FRONTEND_URL: string;
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
}

const requiredEnvVars: string[] = [
  "PORT",
  "DATABASE_URL",
  "NODE_ENV",
  "SUPER_ADMIN_EMAIL",
  "SUPER_ADMIN_PASSWORD",
  "JWT_ACCESS_SECRET",
  "JWT_ACCESS_EXPIRES",
  "BCRYPT_SALT_ROUND",
  "FRONTEND_URL",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
];

const missing = requiredEnvVars.filter((key) => !process.env[key]);
if (missing.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missing.join(", ")}. ` +
      `Please check your .env file (see .env.example for reference).`
  );
}

export const envVars: EnvConfig = {
  PORT: Number(process.env.PORT),
  DATABASE_URL: process.env.DATABASE_URL as string,
  NODE_ENV: process.env.NODE_ENV as "development" | "production",
  SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
  SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD as string,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
  JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES as string,
  BCRYPT_SALT_ROUND: Number(process.env.BCRYPT_SALT_ROUND),
  FRONTEND_URL: process.env.FRONTEND_URL as string,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY as string,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET as string,
};
