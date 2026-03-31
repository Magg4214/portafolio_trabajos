import { Router } from 'express';
import { notesRouter } from '../notes/notes.routes';
import { categoriesRouter } from '../categories/categories.routes';

export const router = Router();

router.use('/notes', notesRouter);
router.use('/categories', categoriesRouter);
