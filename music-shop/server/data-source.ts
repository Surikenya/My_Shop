import { DataSource } from 'typeorm';
import { fileURLToPath } from 'url';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '5647382910',
  database: 'music_shop',
  entities: [new URL('./**/*.entity.{ts,js}', import.meta.url).pathname],
  migrations: [new URL('./migration/**/*.{ts,js}', import.meta.url).pathname],
});
