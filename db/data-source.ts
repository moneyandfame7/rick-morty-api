import 'dotenv/config'
import { DataSource, type DataSourceOptions } from 'typeorm'
import type { SeederOptions } from 'typeorm-extension'
import { MainSeeder } from './seeds/0_main.seeder'

export const dataSourceOptions: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: false,
  migrationsTableName: 'migrations_typeorm',
  seeds: [MainSeeder],
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/db/migrations/*.js'],
  factories: ['./db/factories/**/*.ts']
}

const dataSource = new DataSource(dataSourceOptions)
export default dataSource
