
import app from "./app";
import { envVars } from "./config/env";


import { prisma } from "./config/prisma";
import { seedSuperAdmin } from "./utils/seedSuperAdmin";

const startServer = async () => {
  try {
   
    await prisma.$connect();
    console.log("Connected to PostgreSQL");

 
    await seedSuperAdmin();

    app.listen(envVars.PORT, () => {
      console.log(`server is listening on http://localhost:${envVars.PORT}`);
      console.log(`API base: http://localhost:${envVars.PORT}/api`);
    });
  } catch (error) {
    console.error(" Failed to start server:", error);
    process.exit(1);
  }
};
startServer();