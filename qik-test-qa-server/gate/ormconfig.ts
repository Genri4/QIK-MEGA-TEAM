import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const config: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT) || 5432,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,

  synchronize: false,

  logging: true,
  entities: ['libs/domains/**/*.entities.ts'],
  migrations: ['apps/migrations/*.ts'],
  migrationsTableName: 'typeorm_migrations',
};

export const AppDataSource = new DataSource(config);
export default config;
