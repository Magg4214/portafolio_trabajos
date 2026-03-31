import { NextFunction, Request, Response } from 'express';
import { ZodSchema, z } from 'zod';

export const validateBody = (schema: ZodSchema) => (req: Request, _res: Response, next: NextFunction) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return next(parsed.error);
  req.body = parsed.data;
  return next();
};

export const validateQuery = (schema: ZodSchema) => (req: Request, _res: Response, next: NextFunction) => {
  const parsed = schema.safeParse(req.query as any);
  if (!parsed.success) return next(parsed.error);
  req.query = parsed.data as any;
  return next();
};

export const validateParams = (schema: ZodSchema) => (req: Request, _res: Response, next: NextFunction) => {
  const parsed = schema.safeParse(req.params as any);
  if (!parsed.success) return next(parsed.error);
  req.params = parsed.data as any;
  return next();
};

// Common param schemas
export const idParamSchema = z.object({ id: z.coerce.number().int().positive() });
export const noteAndCategoryParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
  categoryId: z.coerce.number().int().positive(),
});
