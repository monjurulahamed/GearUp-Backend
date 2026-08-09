"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app/app"));
const env_1 = require("./app/config/env");
const prisma_1 = require("./app/config/prisma");
const seedSuperAdmin_1 = require("./app/utils/seedSuperAdmin");
const startServer = async () => {
    try {
        await prisma_1.prisma.$connect();
        console.log("Connected to PostgreSQL");
        await (0, seedSuperAdmin_1.seedSuperAdmin)();
        app_1.default.listen(env_1.envVars.PORT, () => {
            console.log(`server is listening on http://localhost:${env_1.envVars.PORT}`);
            console.log(`API base: http://localhost:${env_1.envVars.PORT}/api`);
        });
    }
    catch (error) {
        console.error(" Failed to start server:", error);
        process.exit(1);
    }
};
startServer();
exports.default = app_1.default;
//# sourceMappingURL=server.js.map