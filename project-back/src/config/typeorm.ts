import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenvConfig({ path: '.env' });

const config = {
  type: 'mssql',
  host: `${process.env.DATABASE_HOST}`,
  port: Number(`${process.env.DATABASE_PORT}`),
  username: `${process.env.DATABASE_USER}`,
  password: `${process.env.DATABASE_PASSWORD}`,
  database: `${process.env.DATABASE_NAME}`,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/db/migrations/*{.ts,.js}'],
  autoLoadEntities: true,
  synchronize: false,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
  seeds: ['dist/db/seeds/1752536215183-template{.ts,.js}'],
};

export default registerAs('typeorm', () => config);
export const connectionSourse = new DataSource(config as DataSourceOptions);
