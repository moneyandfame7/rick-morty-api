import { DataSource } from 'typeorm'
import { runSeeder, Seeder } from 'typeorm-extension'

import { CharacterSeeder, CharacterToEpisodeSeeder, EpisodeSeeder, LocationSeeder, RoleSeeder } from './index'

export class MainSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    await runSeeder(dataSource, LocationSeeder)
    await runSeeder(dataSource, EpisodeSeeder)
    await runSeeder(dataSource, CharacterSeeder)
    await runSeeder(dataSource, CharacterToEpisodeSeeder)
    await runSeeder(dataSource, RoleSeeder)
  }
}
