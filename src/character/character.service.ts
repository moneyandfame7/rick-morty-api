import { Injectable, NotFoundException } from '@nestjs/common'
import { FindManyOptions, Repository } from 'typeorm'
import { CreateCharacterDto } from './dto/create-character.dto'
import { UpdateCharacterDto } from './dto/update-character.dto'
import { Character } from './entities/character.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { PageOptionsDto } from 'src/common/page-info/dto/page-options.dto'
import { PageDto } from '../common/page-info/dto/page.dto'
import { PageInfoDto } from '../common/page-info/dto/page-info.dto'

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

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<CreateCharacterDto>> {
    /*const [characters, count] = await this.characterRepository.findAndCount({ ...this.relations, ...query })
    console.log(characters)
    if (!characters.length) {
      throw new NotFoundException('Characters not found')
    }
    return { characters, count }
*/
    const queryBuilder = this.characterRepository.createQueryBuilder('character')
    queryBuilder
      .orderBy('character.id', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take)
      .leftJoinAndSelect('character.origin', 'origin')
      .leftJoinAndSelect('character.location', 'location')
      .leftJoinAndSelect('character.episodes', 'episodes')
      .addOrderBy('episodes.id', 'ASC')
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

  async getCount() {
    return await this.characterRepository.count()
  }

  async update(id: number, updateCharacterDto: UpdateCharacterDto) {
    return await this.characterRepository.update(id, updateCharacterDto)
  }

  async remove(id: number) {
    return await this.characterRepository.delete(id)
  }
}
