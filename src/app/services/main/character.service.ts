import { Injectable } from '@nestjs/common'
import * as sharp from 'sharp'
import type { PutObjectCommandInput } from '@aws-sdk/client-s3'

import { PaginationService, S3Service } from '@app/services/common'
import { QueryPaginationDto } from '@app/dto/common'
import { CreateCharacterDto, QueryCharacterDto, UpdateCharacterDto } from '@app/dto/main'

import type { BaseService } from '@core/services/main'
import type { Presenter } from '@core/services/common'

import { Character } from '@infrastructure/entities/main'
import { CharacterRepository } from '@infrastructure/repositories/main'

import { CharacterException } from '@common/exceptions/main'

@Injectable()
export class CharacterService implements BaseService<Character, CreateCharacterDto, UpdateCharacterDto, QueryCharacterDto> {
  public constructor(
    private readonly characterRepository: CharacterRepository,
    private readonly s3Service: S3Service,
    private readonly paginationService: PaginationService<Character>,
    private readonly charactersException: CharacterException
  ) {}

  public async createOne(createCharacterDto: CreateCharacterDto, file: Express.Multer.File): Promise<Character> {
    const exists = await this.characterRepository.findOneBy({
      name: createCharacterDto.name,
      type: createCharacterDto.type,
      status: createCharacterDto.status,
      species: createCharacterDto.species
    })
    if (exists) {
      throw this.charactersException.alreadyExists()
    }
    if (!file) {
      throw this.charactersException.emptyFile()
    }
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

  public async getMany(queryPaginationDto: QueryPaginationDto, queryCharacterDto: QueryCharacterDto): Promise<Presenter<Character>> {
    const { characters, count } = await this.characterRepository.getMany(queryPaginationDto, queryCharacterDto)

    if (!count || !characters) {
      throw this.charactersException.manyNotFound()
    }

    const buildPaginationInfo = this.paginationService.buildPaginationInfo({ queryPaginationDto, count })
    return this.paginationService.wrapEntityWithPaginationInfo(characters, buildPaginationInfo)
  }

  public async getOne(id: number): Promise<Character> {
    const character = await this.characterRepository.getOne(id)

    if (!character) {
      throw this.charactersException.withIdNotFound(id)
    }

    return character
  }

  public async updateOne(id: number, updateCharacterDto: UpdateCharacterDto): Promise<Character> {
    const character = await this.characterRepository.getOne(id)

    if (!character) {
      throw this.charactersException.withIdNotFound(id)
    }

    return this.characterRepository.updateOne(id, updateCharacterDto)
  }

  public async removeOne(id: number): Promise<Character> {
    const character = await this.characterRepository.getOne(id)

    if (!character) {
      throw this.charactersException.withIdNotFound(id)
    }

    return this.characterRepository.removeOne(id)
  }

  public async getCount(): Promise<number> {
    return this.characterRepository.getCount()
  }
}
