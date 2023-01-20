import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, SelectQueryBuilder } from 'typeorm'
import { CreateCharacterDto } from './dto/create-character.dto'
import { UpdateCharacterDto } from './dto/update-character.dto'
import { QueryCharacterDto } from './dto/query-character.dto'
import { Character } from './entities/character.entity'
import { PageOptionsDto } from 'src/shared/page-info/dto/page-options.dto'
import { PageDto } from '../shared/page-info/dto/page.dto'
import { PageInfoDto } from '../shared/page-info/dto/page-info.dto'

@Injectable()
export class CharacterService {
  constructor(@InjectRepository(Character) private readonly characterRepository: Repository<Character>) {}

  private get _builder() {
    return this.characterRepository.createQueryBuilder('character')
  }

  private _buildSearchFilters(builder: SelectQueryBuilder<Character>, filters: QueryCharacterDto) {
    filters.id ? builder.where('character.id IN (:...ids)', { ids: filters.id }) : null

    filters.name ? builder.andWhere('character.name ilike :name', { name: `%${filters.name}%` }) : null

    filters.gender ? builder.andWhere('character.gender = :gender', { gender: filters.gender }) : null

    filters.episode_name
      ? builder.andWhere('episodes.name ilike :episode_name', { episode_name: `%${filters.episode_name}%` })
      : null

    filters.type ? builder.andWhere('character.type = :type', { type: filters.type }) : null

    filters.status ? builder.andWhere('character.status = :status', { status: filters.status }) : null

    filters.species ? builder.andWhere('character.species = :species', { species: filters.species }) : null
  }

  private _buildRelations(builder: SelectQueryBuilder<Character>) {
    builder
      .leftJoinAndSelect('character.origin', 'origin')
      .leftJoinAndSelect('character.location', 'location')
      .loadAllRelationIds({ relations: ['episodes'] })
  }

  async create(createCharacterDto: CreateCharacterDto) {
    const character = this.characterRepository.create(createCharacterDto)
    return await this.characterRepository.save(character)
  }

  async findAll(pageOptionsDto: PageOptionsDto, queryCharacter: QueryCharacterDto) {
    console.log(queryCharacter)
    const queryBuilder = this._builder
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take)
      .addOrderBy('character.id', pageOptionsDto.order)
    this._buildRelations(queryBuilder)
    this._buildSearchFilters(queryBuilder, queryCharacter)

    const count = await queryBuilder.getCount()
    const characters = await queryBuilder.getMany()

    if (!characters.length) throw new NotFoundException(`Characters not found.`)

    const pageInfoDto = new PageInfoDto({ pageOptionsDto, count })
    return new PageDto(characters, pageInfoDto)
  }

  async findOne(id: number) {
    const queryBuilder = this._builder
    this._buildRelations(queryBuilder)

    const character = await queryBuilder.where('character.id = :id', { id }).getOne()
    if (!character) throw new BadRequestException(`Character with id ${id}  does not exist.`)

    return character
  }

  async update(id: number, updateCharacterDto: UpdateCharacterDto) {
    return await this.characterRepository.update(id, updateCharacterDto)
  }

  async remove(id: number) {
    return await this.characterRepository.delete(id)
  }

  async count() {
    return await this._builder.getCount()
  }
}
