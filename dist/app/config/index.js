"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const node_process_1 = require("node:process");
(0, dotenv_1.configDotenv)();
const config = {
    PORT: node_process_1.env.PORT,
    DATABASAE_URL: node_process_1.env.DATABASAE_URL,
};
exports.default = config;
//# sourceMappingURL=index.js.map