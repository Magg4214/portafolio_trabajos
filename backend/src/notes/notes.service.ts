import { Repository } from 'typeorm';
import { AppDataSource } from '../shared/data-source';
import { Note } from './note.entity';
import { Category } from '../categories/category.entity';
import { CreateNoteDto, UpdateNoteDto } from './notes.dto';
import { HttpError } from '../middlewares/errorHandler';

export class NotesService {
  private noteRepo: Repository<Note> = AppDataSource.getRepository(Note);
  private categoryRepo: Repository<Category> = AppDataSource.getRepository(Category);

  async create(data: CreateNoteDto): Promise<Note> {
    const note = this.noteRepo.create({ ...data, archived: false });
    return this.noteRepo.save(note);
  }

  async findById(id: number): Promise<Note> {
    const note = await this.noteRepo.findOne({ where: { id }, relations: { categories: true } });
    if (!note) throw new HttpError(404, 'Note not found');
    return note;
  }

  async update(id: number, data: UpdateNoteDto): Promise<Note> {
    const note = await this.findById(id);
    Object.assign(note, data);
    return this.noteRepo.save(note);
  }

  async remove(id: number): Promise<void> {
    const note = await this.findById(id);
    await this.noteRepo.remove(note);
  }

  async setArchived(id: number, archived: boolean): Promise<Note> {
    const note = await this.findById(id);
    note.archived = archived;
    return this.noteRepo.save(note);
  }

  async list(params: { archived?: boolean; categoryId?: number }): Promise<Note[]> {
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

  async addCategory(noteId: number, categoryId: number): Promise<Note> {
    const note = await this.findById(noteId);
    const category = await this.categoryRepo.findOne({ where: { id: categoryId } });
    if (!category) throw new HttpError(404, 'Category not found');
    note.categories = Array.isArray(note.categories) ? note.categories : [];
    if (!note.categories.find((c) => c.id === category.id)) {
      note.categories.push(category);
    }
    return this.noteRepo.save(note);
  }

  async removeCategory(noteId: number, categoryId: number): Promise<Note> {
    const note = await this.findById(noteId);
    note.categories = (note.categories || []).filter((c) => c.id !== categoryId);
    return this.noteRepo.save(note);
  }
}
