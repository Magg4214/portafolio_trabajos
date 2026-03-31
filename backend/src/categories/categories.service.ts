import { Repository } from 'typeorm';
import { AppDataSource } from '../shared/data-source';
import { Category } from './category.entity';
import { CreateCategoryDto } from './categories.dto';
import { HttpError } from '../middlewares/errorHandler';

export class CategoriesService {
  private categoryRepo: Repository<Category> = AppDataSource.getRepository(Category);

  async create(data: CreateCategoryDto): Promise<Category> {
    const exists = await this.categoryRepo.findOne({ where: { name: data.name } });
    if (exists) throw new HttpError(409, 'Category already exists');
    const category = this.categoryRepo.create(data);
    return this.categoryRepo.save(category);
  }

  async list(): Promise<Category[]> {
    return this.categoryRepo.find({ order: { name: 'ASC' } });
  }

  async remove(id: number): Promise<void> {
    const category = await this.categoryRepo.findOne({ where: { id } });
    if (!category) throw new HttpError(404, 'Category not found');
    await this.categoryRepo.remove(category);
  }
}
