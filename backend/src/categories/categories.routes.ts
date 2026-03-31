import { Router } from 'express';
import { CategoriesService } from './categories.service';
import { validateBody, validateParams, idParamSchema } from '../shared/validate';
import { createCategorySchema } from './categories.dto';

export const categoriesRouter = Router();
const service = new CategoriesService();

// Create category
categoriesRouter.post('/', validateBody(createCategorySchema), async (req, res) => {
  const cat = await service.create(req.body);
  res.status(201).json(cat);
});

// List categories
categoriesRouter.get('/', async (_req, res) => {
  const cats = await service.list();
  res.json(cats);
});

// Delete category
categoriesRouter.delete('/:id', validateParams(idParamSchema), async (req, res) => {
  await service.remove((req.params as any).id as number);
  res.status(204).send();
});
