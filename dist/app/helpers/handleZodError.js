"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleZodError = void 0;
const handleZodError = (err) => {
    const errorSources = err.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
    }));
    return {
        statusCode: 400,
        message: "Validation error",
        errorSources,
    };
};
exports.handleZodError = handleZodError;
//# sourceMappingURL=handleZodError.js.map