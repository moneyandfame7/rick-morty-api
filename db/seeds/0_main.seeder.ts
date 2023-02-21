import type { DataSource } from 'typeorm'
import { runSeeder, type Seeder } from 'typeorm-extension'
import { LocationSeeder } from './1_location.seeder'
import { EpisodeSeeder } from './2_episode.seeder'
import { CharacterSeeder } from './3_character.seeder'
import { CharacterToEpisodeSeeder } from './4_character-to-episode.seeder'
import { RoleSeeder } from './5_role.seeder'

export class MainSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    await runSeeder(dataSource, LocationSeeder)
    await runSeeder(dataSource, EpisodeSeeder)
    await runSeeder(dataSource, CharacterSeeder)
    await runSeeder(dataSource, CharacterToEpisodeSeeder)
    await runSeeder(dataSource, RoleSeeder)
  }
}
