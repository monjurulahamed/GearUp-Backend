"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedSuperAdmin = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = require("../config/prisma");
const env_1 = require("../config/env");
const seedSuperAdmin = async () => {
    try {
        const existing = await prisma_1.prisma.user.findUnique({
            where: { email: env_1.envVars.SUPER_ADMIN_EMAIL },
        });
        const hashedPassword = await bcryptjs_1.default.hash(env_1.envVars.SUPER_ADMIN_PASSWORD, env_1.envVars.BCRYPT_SALT_ROUND);
        if (!existing) {
            await prisma_1.prisma.user.create({
                data: {
                    name: "Super Admin",
                    email: env_1.envVars.SUPER_ADMIN_EMAIL,
                    password: hashedPassword,
                    role: "ADMIN",
                    status: "ACTIVE",
                },
            });
            console.log(`Super Admin seeded — ${env_1.envVars.SUPER_ADMIN_EMAIL}`);
            return;
        }
        if (existing.role !== "ADMIN" ||
            !(await bcryptjs_1.default.compare(env_1.envVars.SUPER_ADMIN_PASSWORD, existing.password))) {
            await prisma_1.prisma.user.update({
                where: { email: env_1.envVars.SUPER_ADMIN_EMAIL },
                data: {
                    role: "ADMIN",
                    password: hashedPassword,
                    status: "ACTIVE",
                },
            });
            console.log(`Super Admin updated — ${env_1.envVars.SUPER_ADMIN_EMAIL}`);
        }
    }
    catch (err) {
        console.error("Failed to seed super admin:", err);
    }
};
exports.seedSuperAdmin = seedSuperAdmin;
//# sourceMappingURL=seedSuperAdmin.js.map