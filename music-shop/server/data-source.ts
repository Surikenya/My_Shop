import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '5647382910',
  database: 'music_shop',
  entities: ['src/**/*.entity.{ts,js}'],
  migrations: [`${__dirname}/migrations/*{.ts,.js}`],
});
