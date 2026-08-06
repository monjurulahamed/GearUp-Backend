import bcryptjs from "bcryptjs";
import { prisma } from "../config/prisma";
import { envVars } from "../config/env";


export const seedSuperAdmin = async () => {
  try {
    const existing = await prisma.user.findUnique({
      where: { email: envVars.SUPER_ADMIN_EMAIL },
    });

    const hashedPassword = await bcryptjs.hash(
      envVars.SUPER_ADMIN_PASSWORD,
      envVars.BCRYPT_SALT_ROUND
    );

    if (!existing) {
      await prisma.user.create({
        data: {
          name: "Super Admin",
          email: envVars.SUPER_ADMIN_EMAIL,
          password: hashedPassword,
          role: "ADMIN",
          status: "ACTIVE",
        },
      });
      console.log(`Super Admin seeded — ${envVars.SUPER_ADMIN_EMAIL}`);
      return;
    }

  
    if (
      existing.role !== "ADMIN" ||
      !(await bcryptjs.compare(envVars.SUPER_ADMIN_PASSWORD, existing.password))
    ) {
      await prisma.user.update({
        where: { email: envVars.SUPER_ADMIN_EMAIL },
        data: {
          role: "ADMIN",
          password: hashedPassword,
          status: "ACTIVE",
        },
      });
      console.log(`👑 Super Admin updated — ${envVars.SUPER_ADMIN_EMAIL}`);
    }
  } catch (err) {
    console.error("Failed to seed super admin:", err);
    
  }
};
