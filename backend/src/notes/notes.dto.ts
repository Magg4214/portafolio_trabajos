import { z } from 'zod';

export const createNoteSchema = z.object({
  title: z.string().min(1).max(255),
  content: z.string().min(1),
});

export const updateNoteSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  content: z.string().min(1).optional(),
});

export const listNotesQuerySchema = z.object({
  archived: z
    .union([z.literal('true'), z.literal('false')])
    .transform((v) => v === 'true')
    .optional(),
  categoryId: z.coerce.number().int().positive().optional(),
});

export type CreateNoteDto = z.infer<typeof createNoteSchema>;
export type UpdateNoteDto = z.infer<typeof updateNoteSchema>;
