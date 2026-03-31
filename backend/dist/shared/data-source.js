"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const note_entity_1 = require("../notes/note.entity");
const category_entity_1 = require("../categories/category.entity");
const DB_TYPE = process.env.DB_TYPE || 'sqlite';
exports.AppDataSource = new typeorm_1.DataSource({
    type: DB_TYPE,
    database: process.env.DB_NAME || 'notes.sqlite',
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
    synchronize: true, // For exercise/demo. In production, use migrations.
    logging: false,
    entities: [note_entity_1.Note, category_entity_1.Category],
});
//# sourceMappingURL=data-source.js.map