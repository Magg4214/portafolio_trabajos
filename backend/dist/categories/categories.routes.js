"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoriesRouter = void 0;
const express_1 = require("express");
const categories_service_1 = require("./categories.service");
const validate_1 = require("../shared/validate");
const categories_dto_1 = require("./categories.dto");
exports.categoriesRouter = (0, express_1.Router)();
const service = new categories_service_1.CategoriesService();
// Create category
exports.categoriesRouter.post('/', (0, validate_1.validateBody)(categories_dto_1.createCategorySchema), async (req, res) => {
    const cat = await service.create(req.body);
    res.status(201).json(cat);
});
// List categories
exports.categoriesRouter.get('/', async (_req, res) => {
    const cats = await service.list();
    res.json(cats);
});
// Delete category
exports.categoriesRouter.delete('/:id', (0, validate_1.validateParams)(validate_1.idParamSchema), async (req, res) => {
    await service.remove(req.params.id);
    res.status(204).send();
});
//# sourceMappingURL=categories.routes.js.map