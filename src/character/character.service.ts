import { Injectable, NotFoundException } from '@nestjs/common'
import { FindManyOptions, Repository } from 'typeorm'
import { CreateCharacterDto } from './dto/create-character.dto'
import { UpdateCharacterDto } from './dto/update-character.dto'
import { Character } from './entities/character.entity'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class CharacterService {
  private readonly relations: FindManyOptions<Character> = {
    relations: ['origin', 'location'],
    loadRelationIds: {
      relations: ['episodes']
    }
  }

  constructor(@InjectRepository(Character) private readonly characterRepository: Repository<Character>) {}

  async create(createCharacterDto: CreateCharacterDto) {
    const character = await this.characterRepository.create(createCharacterDto)
    return await this.characterRepository.save(character)
  }

  async findAll(query?: any) {
    // const characters = await this.characterRepository
    //   .createQueryBuilder('character')
    //   .leftJoinAndSelect('character.origin', 'origin')
    //   .leftJoinAndSelect('character.location', 'location')
    //   .leftJoinAndSelect('character.episodes', 'episodes')
    //   .select(['character', 'origin.id', 'location.name', 'episodes.id'])
    //   .cache(1000)
    //   .getMany()
    const characters = await this.characterRepository.find(this.relations)

    if (!characters) {
      throw new NotFoundException(`Characters not found`)
    }
    return characters
  }

  async findOne(id: number) {
    const character = await this.characterRepository.findOne({
      ...this.relations,
      where: {
        id
      }
    })
    // const character = await this.characterRepository
    //   .createQueryBuilder('character')
    //   .leftJoinAndSelect('character.origin', 'origin')
    //   .leftJoinAndSelect('character.location', 'location')
    //   .leftJoinAndSelect('character.episodes', 'episodes')
    //   .select(['character', 'origin.id', 'location.name', 'episodes.id'])
    //   .where('character.id=:id', { id })
    //   .getOne()
    if (!character) {
      throw new NotFoundException(`Character with id ${id} not found`)
    }
    return character
  }

  async findAllByEpisode(episodeId: number) {
    // TODO: закинути це в findAll і через query ?episode_id=$id$ шукати
    // TODO: зробити функцію в яку ми передаємо characters, і викидуємо помилку ( мб )
    const characters = await this.characterRepository.find({
      where: {
        episodes: { id: episodeId }
      }
    })
    if (!characters.length) {
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
