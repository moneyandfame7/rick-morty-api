import { Injectable, NotFoundException } from '@nestjs/common'
import { FindManyOptions, Repository, SelectQueryBuilder } from 'typeorm'
import { CreateCharacterDto } from './dto/create-character.dto'
import { UpdateCharacterDto } from './dto/update-character.dto'
import { Character } from './entities/character.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { PageOptionsDto } from 'src/common/page-info/dto/page-options.dto'
import { PageDto } from '../common/page-info/dto/page.dto'
import { PageInfoDto } from '../common/page-info/dto/page-info.dto'
import { QueryCharacterDto } from './dto/query-character.dto'

@Injectable()
export class CharacterService {
  private readonly relations: FindManyOptions<Character> = {
    relations: ['origin', 'location'],
    loadRelationIds: {
      relations: ['episodes']
    }
  }

  constructor(@InjectRepository(Character) private readonly characterRepository: Repository<Character>) {}

  private buildSearchFilters(builder: SelectQueryBuilder<Character>, filters?: QueryCharacterDto) {
    filters.id ? builder.where('character.id IN (:...ids)', { ids: filters.id }) : null

    filters.name ? builder.andWhere('character.name ilike :name', { name: `%${filters.name}%` }) : null

    filters.gender ? builder.andWhere('character.gender = :gender', { gender: filters.gender }) : null

    filters.episode_name
      ? builder.andWhere('episodes.name = :episode_name', { episode_name: filters.episode_name })
      : null

    filters.type ? builder.andWhere('character.type = :type', { type: filters.type }) : null

    filters.status ? builder.andWhere('character.status = :status', { status: filters.status }) : null

    filters.species ? builder.andWhere('character.species = :species', { species: filters.species }) : null
  }

  async create(createCharacterDto: CreateCharacterDto) {
    const character = await this.characterRepository.create(createCharacterDto)
    return await this.characterRepository.save(character)
  }

  async findAll(
    pageOptionsDto: PageOptionsDto,
    queryCharacter: QueryCharacterDto
  ): Promise<PageDto<CreateCharacterDto>> {
    const queryBuilder = this.characterRepository
      .createQueryBuilder('character')
      .leftJoinAndSelect('character.origin', 'origin')
      .leftJoinAndSelect('character.location', 'location')
      .leftJoinAndSelect('character.episodes', 'episodes')
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take)
      .addOrderBy('character.id', pageOptionsDto.order)

    this.buildSearchFilters(queryBuilder, queryCharacter)

    const count = await queryBuilder.getCount()
    const characters = await queryBuilder.getMany()
    const pageInfoDto = new PageInfoDto({ pageOptionsDto, count })
    return new PageDto(characters, pageInfoDto)
  }

  async findOne(id: number) {
    const character = await this.characterRepository.findOne({
      ...this.relations,
      where: {
        id
      }
    })
    if (!character) {
      throw new NotFoundException(`Character with id ${id} not found`)
    }
    return character
  }

  async update(id: number, updateCharacterDto: UpdateCharacterDto) {
    return await this.characterRepository.update(id, updateCharacterDto)
  }

  async remove(id: number) {
    return await this.characterRepository.delete(id)
  }
}
