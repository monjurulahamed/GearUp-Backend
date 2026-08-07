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
exports.updateOrderStatusZodSchema = exports.createRentalZodSchema = void 0;
const z = __importStar(require("zod"));
exports.createRentalZodSchema = z.object({
    body: z
        .object({
        startDate: z.string({ required_error: "startDate is required" }).refine((val) => !isNaN(Date.parse(val)), "Invalid startDate — must be ISO string"),
        endDate: z.string({ required_error: "endDate is required" }).refine((val) => !isNaN(Date.parse(val)), "Invalid endDate — must be ISO string"),
        items: z
            .array(z.object({
            gearItemId: z.string({ required_error: "gearItemId is required" }),
            quantity: z
                .number()
                .int("Quantity must be an integer")
                .min(1, "Quantity must be at least 1")
                .default(1),
        }))
            .min(1, "At least one gear item is required"),
        notes: z.string().max(500).optional(),
    })
        .refine((data) => new Date(data.endDate) >= new Date(data.startDate), "endDate must be on or after startDate")
        .refine((data) => new Date(data.startDate) >= new Date(new Date().toDateString()), "startDate cannot be in the past"),
});
exports.updateOrderStatusZodSchema = z.object({
    body: z.object({
        status: z.enum(["CONFIRMED", "PICKED_UP", "RETURNED", "CANCELLED"], {
            required_error: "status is required",
        }),
    }),
});
//# sourceMappingURL=rental.validation.js.map