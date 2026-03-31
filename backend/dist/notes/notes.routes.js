"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notesRouter = void 0;
const express_1 = require("express");
const validate_1 = require("../shared/validate");
const notes_dto_1 = require("./notes.dto");
const notes_service_1 = require("./notes.service");
exports.notesRouter = (0, express_1.Router)();
const service = new notes_service_1.NotesService();
// Create note
exports.notesRouter.post('/', (0, validate_1.validateBody)(notes_dto_1.createNoteSchema), async (req, res) => {
    const note = await service.create(req.body);
    res.status(201).json(note);
});
// List notes with optional filters
exports.notesRouter.get('/', (0, validate_1.validateQuery)(notes_dto_1.listNotesQuerySchema), async (req, res) => {
    const { archived, categoryId } = req.query;
    const notes = await service.list({ archived, categoryId });
    res.json(notes);
});
// Get one
exports.notesRouter.get('/:id', (0, validate_1.validateParams)(validate_1.idParamSchema), async (req, res) => {
    const id = req.params.id;
    const note = await service.findById(id);
    res.json(note);
});
// Update (title/content)
exports.notesRouter.put('/:id', (0, validate_1.validateParams)(validate_1.idParamSchema), (0, validate_1.validateBody)(notes_dto_1.updateNoteSchema), async (req, res) => {
    const id = req.params.id;
    const note = await service.update(id, req.body);
    res.json(note);
});
// Archive
exports.notesRouter.patch('/:id/archive', (0, validate_1.validateParams)(validate_1.idParamSchema), async (req, res) => {
    const id = req.params.id;
    const note = await service.setArchived(id, true);
    res.json(note);
});
// Unarchive
exports.notesRouter.patch('/:id/unarchive', (0, validate_1.validateParams)(validate_1.idParamSchema), async (req, res) => {
    const id = req.params.id;
    const note = await service.setArchived(id, false);
    res.json(note);
});
// Delete
exports.notesRouter.delete('/:id', (0, validate_1.validateParams)(validate_1.idParamSchema), async (req, res) => {
    const id = req.params.id;
    await service.remove(id);
    res.status(204).send();
});
// Add category to note
exports.notesRouter.post('/:id/categories/:categoryId', (0, validate_1.validateParams)(validate_1.noteAndCategoryParamsSchema), async (req, res) => {
    const { id, categoryId } = req.params;
    const note = await service.addCategory(id, categoryId);
    res.json(note);
});
// Remove category from note
exports.notesRouter.delete('/:id/categories/:categoryId', (0, validate_1.validateParams)(validate_1.noteAndCategoryParamsSchema), async (req, res) => {
    const { id, categoryId } = req.params;
    const note = await service.removeCategory(id, categoryId);
    res.json(note);
});
//# sourceMappingURL=notes.routes.js.map