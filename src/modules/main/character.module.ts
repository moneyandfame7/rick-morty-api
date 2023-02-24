import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CharacterService } from '@app/services/main/character.service'
import { CharacterController } from '@app/controllers/main/character.controller'

import { Character } from '@infrastructure/entities/main/character.entity'
import { CharacterRepository } from '@infrastructure/repositories/main/character.repository'

import { CharactersException } from '@common/exceptions/main/characters.exception'

import { S3Module } from '@modules/common/s3.module'
import { TokenModule } from '@modules/common/token.module'
import { PaginationModule } from '@modules/common/pagination.module'
import { ApiErrorModule } from '@modules/common/api-error.module'

@Module({
  imports: [TypeOrmModule.forFeature([Character]), S3Module, TokenModule, PaginationModule, ApiErrorModule],
  controllers: [CharacterController],
  providers: [CharacterService, CharacterRepository, CharactersException]
})
export class CharacterModule {}
