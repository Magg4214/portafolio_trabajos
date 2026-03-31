"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noteAndCategoryParamsSchema = exports.idParamSchema = exports.validateParams = exports.validateQuery = exports.validateBody = void 0;
const zod_1 = require("zod");
const validateBody = (schema) => (req, _res, next) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success)
        return next(parsed.error);
    req.body = parsed.data;
    return next();
};
exports.validateBody = validateBody;
const validateQuery = (schema) => (req, _res, next) => {
    const parsed = schema.safeParse(req.query);
    if (!parsed.success)
        return next(parsed.error);
    req.query = parsed.data;
    return next();
};
exports.validateQuery = validateQuery;
const validateParams = (schema) => (req, _res, next) => {
    const parsed = schema.safeParse(req.params);
    if (!parsed.success)
        return next(parsed.error);
    req.params = parsed.data;
    return next();
};
exports.validateParams = validateParams;
// Common param schemas
exports.idParamSchema = zod_1.z.object({ id: zod_1.z.coerce.number().int().positive() });
exports.noteAndCategoryParamsSchema = zod_1.z.object({
    id: zod_1.z.coerce.number().int().positive(),
    categoryId: zod_1.z.coerce.number().int().positive(),
});
//# sourceMappingURL=validate.js.map