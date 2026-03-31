import { api } from './client';
import type { CreateNoteInput, Note, UpdateNoteInput } from '../types';

export const notesApi = {
  async list(params?: { archived?: boolean; categoryId?: number }): Promise<Note[]> {
    const res = await api.get<Note[]>('/notes', { params });
    return res.data;
  },
  async create(body: CreateNoteInput): Promise<Note> {
    const res = await api.post<Note>('/notes', body);
    return res.data;
  },
  async get(id: number): Promise<Note> {
    const res = await api.get<Note>(`/notes/${id}`);
    return res.data;
  },
  async update(id: number, body: UpdateNoteInput): Promise<Note> {
    const res = await api.put<Note>(`/notes/${id}` , body);
    return res.data;
  },
  async remove(id: number): Promise<void> {
    await api.delete(`/notes/${id}`);
  },
  async archive(id: number): Promise<Note> {
    const res = await api.patch<Note>(`/notes/${id}/archive`);
    return res.data;
  },
  async unarchive(id: number): Promise<Note> {
    const res = await api.patch<Note>(`/notes/${id}/unarchive`);
    return res.data;
  },
  async addCategory(id: number, categoryId: number): Promise<Note> {
    const res = await api.post<Note>(`/notes/${id}/categories/${categoryId}`);
    return res.data;
  },
  async removeCategory(id: number, categoryId: number): Promise<Note> {
    const res = await api.delete<Note>(`/notes/${id}/categories/${categoryId}`);
    return res.data;
  },
};
