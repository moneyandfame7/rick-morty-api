import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateCharacterDto } from './dto/create-character.dto'
import { UpdateCharacterDto } from './dto/update-character.dto'
import { QueryCharacterDto } from './dto/query-character.dto'
import { Character } from './entities/character.entity'
import { PageOptionsDto } from 'src/shared/page-info/dto/page-options.dto'
import { PageDto } from '../shared/page-info/dto/page.dto'
import { PageInfoDto } from '../shared/page-info/dto/page-info.dto'
import { CharacterRepository } from './character.repository'
import * as sharp from 'sharp'
import { PutObjectCommandInput } from '@aws-sdk/client-s3'
import { S3Service } from '../s3/s3.service'

@Injectable()
export class CharacterService {
  constructor(private readonly characterRepository: CharacterRepository, private readonly s3Service: S3Service) {}

  async createOne(createCharacterDto: CreateCharacterDto, file: Express.Multer.File) {
    if (!file) throw new HttpException('Field image cannot be empty', HttpStatus.BAD_REQUEST)
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
      Key: `${characterAttributes.id}.${type}`,
      Body: fileBuffer,
      ContentType: file.mimetype,
      ACL: 'public-read'
    }
    characterAttributes.image = await this.s3Service.upload(params)
    const character = await this.characterRepository.createOne(characterAttributes)
    return await this.characterRepository.save(character)
  }

  async getMany(pageOptionsDto: PageOptionsDto, queryCharacterDto: QueryCharacterDto) {
    const { characters, count } = await this.characterRepository.getMany(pageOptionsDto, queryCharacterDto)

    if (!count) throw new BadRequestException(`Characters not found.`)

    const pageInfoDto = new PageInfoDto({ pageOptionsDto, count })
    return new PageDto(characters, pageInfoDto)
  }

  async getOne(id: number): Promise<Character> {
    const character = await this.characterRepository.getOne(id)

    if (!character) throw new BadRequestException(`Character with id ${id}  does not exist.`)

    return character
  }

  async updateOne(id: number, updateCharacterDto: UpdateCharacterDto): Promise<Character> {
    const character = await this.characterRepository.getOne(id)

    if (!character) throw new BadRequestException(`Character with id ${id} does not exist.`)

    return await this.characterRepository.updateOne(id, updateCharacterDto)
  }

  async removeOne(id: number): Promise<Character> {
    const character = await this.characterRepository.getOne(id)

    if (!character) throw new BadRequestException(`Character with id ${id} does not exist.`)

    return await this.characterRepository.removeOne(id)
  }

  async getCount(): Promise<number> {
    return await this.characterRepository.getCount()
  }
}
