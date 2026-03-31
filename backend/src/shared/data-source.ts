import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Note } from '../notes/note.entity';
import { Category } from '../categories/category.entity';

const DB_TYPE = process.env.DB_TYPE || 'sqlite';

export const AppDataSource = new DataSource({
  type: DB_TYPE as any,
  database: process.env.DB_NAME || 'notes.sqlite',
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
  synchronize: true, // For this challenge setup to work out-of-the-box.
  logging: false,
  entities: [Note, Category],
});
