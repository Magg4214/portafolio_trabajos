"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listNotesQuerySchema = exports.updateNoteSchema = exports.createNoteSchema = void 0;
const zod_1 = require("zod");
exports.createNoteSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).max(255),
    content: zod_1.z.string().min(1),
});
exports.updateNoteSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).max(255).optional(),
    content: zod_1.z.string().min(1).optional(),
});
exports.listNotesQuerySchema = zod_1.z.object({
    archived: zod_1.z
        .union([zod_1.z.literal('true'), zod_1.z.literal('false')])
        .transform((v) => v === 'true')
        .optional(),
    categoryId: zod_1.z.coerce.number().int().positive().optional(),
});
//# sourceMappingURL=notes.dto.js.map