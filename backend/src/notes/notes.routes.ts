import { Router } from 'express';
import { validateBody, validateParams, validateQuery, idParamSchema, noteAndCategoryParamsSchema } from '../shared/validate';
import { createNoteSchema, listNotesQuerySchema, updateNoteSchema } from './notes.dto';
import { NotesService } from './notes.service';

export const notesRouter = Router();
const service = new NotesService();

// Create note
notesRouter.post('/', validateBody(createNoteSchema), async (req, res) => {
  const note = await service.create(req.body);
  res.status(201).json(note);
});

// List notes with optional filters
notesRouter.get('/', validateQuery(listNotesQuerySchema), async (req, res) => {
  const { archived, categoryId } = req.query as any;
  const notes = await service.list({ archived, categoryId });
  res.json(notes);
});

// Get one
notesRouter.get('/:id', validateParams(idParamSchema), async (req, res) => {
  const id = (req.params as any).id as number;
  const note = await service.findById(id);
  res.json(note);
});

// Update (title/content)
notesRouter.put('/:id', validateParams(idParamSchema), validateBody(updateNoteSchema), async (req, res) => {
  const id = (req.params as any).id as number;
  const note = await service.update(id, req.body);
  res.json(note);
});

// Archive
notesRouter.patch('/:id/archive', validateParams(idParamSchema), async (req, res) => {
  const id = (req.params as any).id as number;
  const note = await service.setArchived(id, true);
  res.json(note);
});

// Unarchive
notesRouter.patch('/:id/unarchive', validateParams(idParamSchema), async (req, res) => {
  const id = (req.params as any).id as number;
  const note = await service.setArchived(id, false);
  res.json(note);
});

// Delete
notesRouter.delete('/:id', validateParams(idParamSchema), async (req, res) => {
  const id = (req.params as any).id as number;
  await service.remove(id);
  res.status(204).send();
});

// Add category to note
notesRouter.post('/:id/categories/:categoryId', validateParams(noteAndCategoryParamsSchema), async (req, res) => {
  const { id, categoryId } = req.params as any;
  const note = await service.addCategory(id as number, categoryId as number);
  res.json(note);
});

// Remove category from note
notesRouter.delete('/:id/categories/:categoryId', validateParams(noteAndCategoryParamsSchema), async (req, res) => {
  const { id, categoryId } = req.params as any;
  const note = await service.removeCategory(id as number, categoryId as number);
  res.json(note);
});
