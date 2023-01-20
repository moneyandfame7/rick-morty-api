import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Request } from 'express'
import * as _ from 'lodash'
import * as sharp from 'sharp'
import { memoryStorage, StorageEngine } from 'multer'
import { CharacterService } from './character.service'
import { CreateCharacterDto } from './dto/create-character.dto'
import { UpdateCharacterDto } from './dto/update-character.dto'
import { QueryCharacterDto } from './dto/query-character.dto'
import { PageOptionsDto } from '../shared/page-info/dto/page-options.dto'
import { S3Service } from '../s3/s3.service'
import { PutObjectCommandInput } from '@aws-sdk/client-s3'

@Controller('characters')
export class CharacterController {
  constructor(private readonly characterService: CharacterService, private readonly s3Service: S3Service) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
  async create(@Body() character: CreateCharacterDto, @UploadedFile() file: Express.Multer.File) {
    if (!file) throw new HttpException('Field image cannot be empty', HttpStatus.UNPROCESSABLE_ENTITY)
    const fileBuffer = await sharp(file.buffer).resize({ height: 300, width: 300, fit: 'cover' }).toBuffer()
    const charAttributes: CreateCharacterDto = {
      id: (await this.characterService.count()) + 1,
      name: character.name,
      type: character.type,
      status: character.status,
      gender: character.gender,
      species: character.species
    }
    const [, type] = file.mimetype.split('/')

    const params: PutObjectCommandInput = {
      Bucket: this.s3Service.bucketName,
      Key: `${charAttributes.id}.${type}`,
      Body: fileBuffer,
      ContentType: file.mimetype,
      ACL: 'public-read'
    }
    charAttributes.image = await this.s3Service.upload(params)

    return await this.characterService.create(charAttributes)
  }

  @Get()
  async findAll(@Query() query: QueryCharacterDto, @Req() req: Request) {
    const pageOptionsDto: PageOptionsDto = {
      take: query.take,
      page: query.page,
      order: query.order,
      skip: query.skip,
      otherQuery: req.originalUrl,
      endpoint: 'characters'
    }
    const queryCharacterDto: any = _.omitBy(
      {
        id: query.id,
        name: query.name,
        status: query.status,
        species: query.species,
        type: query.type,
        gender: query.gender,
        episode_name: query.episode_name
      },
      _.isNil
    )
    return await this.characterService.findAll(pageOptionsDto, queryCharacterDto as QueryCharacterDto)
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.characterService.findOne(id)
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateCharacterDto: UpdateCharacterDto) {
    return this.characterService.update(id, updateCharacterDto)
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.characterService.remove(id)
  }
}
