import { BadRequestException, Injectable } from '@nestjs/common'
import * as sharp from 'sharp'
import type { PutObjectCommandInput } from '@aws-sdk/client-s3'
import type { CreateCharacterDto, QueryCharacterDto, UpdateCharacterDto } from '@dto/main/character.dto'
import type { Character } from '@entities/main/character.entity'
import type { QueryPaginationDto } from '@dto/common/pagination.dto'
import { CharacterRepository } from '@repositories/main/character.repository'
import { PaginationService, type Payload } from '../common/pagination.service'
import { S3Service } from '../common/s3.service'
import { CharactersNotFoundException, CharacterWithIdNotFoundException } from '@domain/exceptions/main/characters.exception'

@Injectable()
export class CharacterService {
  constructor(private readonly characterRepository: CharacterRepository, private readonly s3Service: S3Service, private readonly paginationService: PaginationService<Character>) {}

  async createOne(createCharacterDto: CreateCharacterDto, file: Express.Multer.File): Promise<Character> {
    if (!file) throw new BadRequestException('You must provide an image')
    const fileBuffer = await sharp(file.buffer).resize({ height: 300, width: 300, fit: 'cover' }).toBuffer()

    const characterAttributes: CreateCharacterDto = {
      id: (await this.getCount()) + 1,
      name: createCharacterDto.name,
      type: createCharacterDto.type,
      status: createCharacterDto.status,
      gender: createCharacterDto.gender,
      species: createCharacterDto.species
    }
    const [, type] = file.mimetype.split('/')

    const params: PutObjectCommandInput = {
      Bucket: this.s3Service.bucketName,
      Key: `characters/${characterAttributes.id}.${type}`,
      Body: fileBuffer,
      ContentType: file.mimetype,
      ACL: 'public-read'
    }
    characterAttributes.image = await this.s3Service.upload(params)
    const character = await this.characterRepository.createOne(characterAttributes)
    return this.characterRepository.save(character)
  }

  async getMany(queryPaginationDto: QueryPaginationDto, queryCharacterDto: QueryCharacterDto): Promise<Payload<Character>> {
    const { characters, count } = await this.characterRepository.getMany(queryPaginationDto, queryCharacterDto)

    if (!count || !characters) throw new CharactersNotFoundException()

    const buildPaginationInfo = this.paginationService.buildPaginationInfo({ queryPaginationDto, count })
    return this.paginationService.wrapEntityWithPaginationInfo(characters, buildPaginationInfo)
  }

  async getOne(id: number): Promise<Character> {
    const character = await this.characterRepository.getOne(id)

    if (!character) throw new CharacterWithIdNotFoundException(id)

    return character
  }

  async updateOne(id: number, updateCharacterDto: UpdateCharacterDto): Promise<Character> {
    const character = await this.characterRepository.getOne(id)

    if (!character) throw new CharacterWithIdNotFoundException(id)

    return this.characterRepository.updateOne(id, updateCharacterDto)
  }

  async removeOne(id: number): Promise<Character> {
    const character = await this.characterRepository.getOne(id)

    if (!character) throw new CharacterWithIdNotFoundException(id)

    return this.characterRepository.removeOne(id)
  }

  async getCount(): Promise<number> {
    return this.characterRepository.getCount()
  }
}
