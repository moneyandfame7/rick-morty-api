import { DataSource } from 'typeorm'
import { Seeder, runSeeder, SeederFactoryManager } from 'typeorm-extension'
import { LocationSeeder } from './1_location.seeder'
import { EpisodeSeeder } from './2_episode.seeder'
import { CharacterSeeder } from './3_character.seeder'
import { CharacterToEpisodeSeeder } from './4_character-to-episode.seeder'

export class MainSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    await runSeeder(dataSource, LocationSeeder)
    await runSeeder(dataSource, EpisodeSeeder)
    await runSeeder(dataSource, CharacterSeeder)
    await runSeeder(dataSource, CharacterToEpisodeSeeder)
  }
}
