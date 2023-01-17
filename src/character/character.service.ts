import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, SelectQueryBuilder } from 'typeorm'
import { CreateCharacterDto } from './dto/create-character.dto'
import { UpdateCharacterDto } from './dto/update-character.dto'
import { Character } from './entities/character.entity'

@Injectable()
export class CharacterService {
  private readonly queryBuilder: SelectQueryBuilder<Character> = this.characterRepository
    .createQueryBuilder('character')
    .leftJoinAndSelect('character.origin', 'origin')
    .leftJoinAndSelect('character.location', 'location')
    .leftJoinAndSelect('character.episodes', 'episodes')
    .select([
      'character',
      'origin.name',
      'origin.type',
      'origin.dimension',
      'location.name',
      'location.type',
      'location.dimension',
      'episodes'
    ])

  constructor(@InjectRepository(Character) private readonly characterRepository: Repository<Character>) {}

  create(createCharacterDto: CreateCharacterDto) {
    const character = this.characterRepository.create(createCharacterDto)
    return this.characterRepository.save(character)
  }

  findAll() {
    const characters = this.characterRepository.find({
      relations: ['origin', 'location'],
      loadRelationIds: {
        relations: ['episodes']
      }
    })
    if (!characters) {
      throw new NotFoundException(`Characters not found`)
    }
    return characters
  }

  async findOne(id: number) {
    const character = await this.characterRepository.findOne({
      where: {
        id
      },
      relations: {
        origin: {}
      }
    })
    if (!character) {
      throw new NotFoundException(`Character with id ${id} not found`)
    }
    return character
  }

  async findAllByEpisode(episodeId: number) {
    // TODO: закинути це в findAll і через query ?episode_id=$id$ шукати
    // TODO: зробити функцію в яку ми передаємо characters, і викидуємо помилку ( мб )
    const characters = await this.characterRepository.find({
      relations: {
        episodes: true,
        origin: true,
        location: true
      },
      where: {
        episodes: {
          id: episodeId
        }
      }
    })
    if (!characters) {
      throw new NotFoundException(`Characters with episodeId ${episodeId} not found`)
    }
    return characters
  }

  async update(id: number, updateCharacterDto: UpdateCharacterDto) {
    return await this.characterRepository.update(id, updateCharacterDto)
  }

  async remove(id: number) {
    return await this.characterRepository.delete(id)
  }
}
