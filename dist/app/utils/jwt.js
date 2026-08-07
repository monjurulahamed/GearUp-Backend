"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const createToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, env_1.envVars.JWT_ACCESS_SECRET, {
        expiresIn: env_1.envVars.JWT_ACCESS_EXPIRES,
    });
};
exports.createToken = createToken;
const verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, env_1.envVars.JWT_ACCESS_SECRET);
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=jwt.js.map