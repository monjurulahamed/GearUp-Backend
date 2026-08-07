"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileZodSchema = exports.loginZodSchema = exports.registerZodSchema = void 0;
const z = __importStar(require("zod/v3"));
exports.registerZodSchema = z.object({
    body: z.object({
        name: z
            .string()
            .min(1, "Name is required")
            .min(2, "Name must be at least 2 characters")
            .max(50, "Name cannot exceed 50 characters"),
        email: z
            .string()
            .min(1, "Email is required")
            .email("Invalid email format"),
        password: z
            .string()
            .min(1, "Password is required")
            .min(8, "Password must be at least 8 characters")
            .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
            .regex(/[a-z]/, "Password must contain at least 1 lowercase letter")
            .regex(/\d/, "Password must contain at least 1 number"),
        phone: z.string().optional(),
        address: z.string().optional(),
        role: z.enum(["CUSTOMER", "PROVIDER"]).default("CUSTOMER"),
    }),
});
exports.loginZodSchema = z.object({
    body: z.object({
        email: z
            .string()
            .min(1, "Email is required")
            .email("Invalid email format"),
        password: z
            .string()
            .min(1, "Password is required"),
    }),
});
exports.updateProfileZodSchema = z.object({
    body: z
        .object({
        name: z
            .string()
            .min(2, "Name must be at least 2 characters")
            .max(50, "Name cannot exceed 50 characters")
            .optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
    })
        .strict(),
});
//# sourceMappingURL=auth.validation.js.map