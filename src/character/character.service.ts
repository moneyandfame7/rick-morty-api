import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateCharacterDto } from './dto/create-character.dto'
import { UpdateCharacterDto } from './dto/update-character.dto'
import { Character } from './entities/character.entity'

@Injectable()
export class CharacterService {
  constructor(@InjectRepository(Character) private readonly charactersRepository: Repository<Character>) {}

  create(createCharacterDto: CreateCharacterDto) {
    const character = this.charactersRepository.create(createCharacterDto)
    return this.charactersRepository.save(character)
  }

  findAll() {
    return this.charactersRepository.find({
      relations: {
        episodes: true
      }
    }) // SELECT * FROM characters
  }

  findOne(id: number) {
    return `This action returns a #${id} character`
  }

  update(id: number, updateCharacterDto: UpdateCharacterDto) {
    return `This action updates a #${id} character`
  }

  remove(id: number) {
    return `This action removes a #${id} character`
  }
}
