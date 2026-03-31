"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesService = void 0;
const data_source_1 = require("../shared/data-source");
const category_entity_1 = require("./category.entity");
const errorHandler_1 = require("../middlewares/errorHandler");
class CategoriesService {
    constructor() {
        this.categoryRepo = data_source_1.AppDataSource.getRepository(category_entity_1.Category);
    }
    async create(data) {
        const exists = await this.categoryRepo.findOne({ where: { name: data.name } });
        if (exists)
            throw new errorHandler_1.HttpError(409, 'Category already exists');
        const category = this.categoryRepo.create(data);
        return this.categoryRepo.save(category);
    }
    async list() {
        return this.categoryRepo.find({ order: { name: 'ASC' } });
    }
    async remove(id) {
        const category = await this.categoryRepo.findOne({ where: { id } });
        if (!category)
            throw new errorHandler_1.HttpError(404, 'Category not found');
        await this.categoryRepo.remove(category);
    }
}
exports.CategoriesService = CategoriesService;
//# sourceMappingURL=categories.service.js.map