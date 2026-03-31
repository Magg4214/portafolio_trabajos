import { api } from './client';
import type { Category } from '../types';

export const categoriesApi = {
  async list(): Promise<Category[]> {
    const res = await api.get<Category[]>('/categories');
    return res.data;
  },
  async create(name: string): Promise<Category> {
    const res = await api.post<Category>('/categories', { name });
    return res.data;
  },
  async remove(id: number): Promise<void> {
    await api.delete(`/categories/${id}`);
  },
};
