"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotesService = void 0;
const data_source_1 = require("../shared/data-source");
const note_entity_1 = require("./note.entity");
const category_entity_1 = require("../categories/category.entity");
const errorHandler_1 = require("../middlewares/errorHandler");
class NotesService {
    constructor() {
        this.noteRepo = data_source_1.AppDataSource.getRepository(note_entity_1.Note);
        this.categoryRepo = data_source_1.AppDataSource.getRepository(category_entity_1.Category);
    }
    async create(data) {
        const note = this.noteRepo.create({ ...data, archived: false });
        return this.noteRepo.save(note);
    }
    async findById(id) {
        const note = await this.noteRepo.findOne({ where: { id }, relations: { categories: true } });
        if (!note)
            throw new errorHandler_1.HttpError(404, 'Note not found');
        return note;
    }
    async update(id, data) {
        const note = await this.findById(id);
        Object.assign(note, data);
        return this.noteRepo.save(note);
    }
    async remove(id) {
        const note = await this.findById(id);
        await this.noteRepo.remove(note);
    }
    async setArchived(id, archived) {
        const note = await this.findById(id);
        note.archived = archived;
        return this.noteRepo.save(note);
    }
    async list(params) {
        const qb = this.noteRepo
            .createQueryBuilder('note')
            .leftJoinAndSelect('note.categories', 'category')
            .orderBy('note.updatedAt', 'DESC');
        if (typeof params.archived === 'boolean') {
            qb.andWhere('note.archived = :archived', { archived: params.archived });
        }
        if (params.categoryId) {
            qb.andWhere('category.id = :categoryId', { categoryId: params.categoryId });
        }
        return qb.getMany();
    }
    async addCategory(noteId, categoryId) {
        const note = await this.findById(noteId);
        const category = await this.categoryRepo.findOne({ where: { id: categoryId } });
        if (!category)
            throw new errorHandler_1.HttpError(404, 'Category not found');
        note.categories = Array.isArray(note.categories) ? note.categories : [];
        if (!note.categories.find((c) => c.id === category.id)) {
            note.categories.push(category);
        }
        return this.noteRepo.save(note);
    }
    async removeCategory(noteId, categoryId) {
        const note = await this.findById(noteId);
        note.categories = (note.categories || []).filter((c) => c.id !== categoryId);
        return this.noteRepo.save(note);
    }
}
exports.NotesService = NotesService;
//# sourceMappingURL=notes.service.js.map