import 'dotenv/config'
import { DataSource, DataSourceOptions } from 'typeorm'
import { SeederOptions } from 'typeorm-extension'
import { MainSeeder } from './seeds/0_main.seeder'
export const dataSourceOptions: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT as any,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: false,
  synchronize: true,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/db/migrations/*.js'],
  migrationsTableName: 'migrations_typeorm',
  seeds: [MainSeeder],
  factories: ['./db/factories/**/*.ts']
}

const dataSource = new DataSource(dataSourceOptions)
export default dataSource
