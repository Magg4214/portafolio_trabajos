"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const notes_routes_1 = require("../notes/notes.routes");
const categories_routes_1 = require("../categories/categories.routes");
exports.router = (0, express_1.Router)();
exports.router.use('/notes', notes_routes_1.notesRouter);
exports.router.use('/categories', categories_routes_1.categoriesRouter);
//# sourceMappingURL=index.js.map