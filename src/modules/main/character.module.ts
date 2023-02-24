import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CharacterService } from '@app/services/main'
import { CharacterController } from '@app/controllers/main'

import { Character } from '@infrastructure/entities/main'
import { CharacterRepository } from '@infrastructure/repositories/main'

import { CharacterException } from '@common/exceptions/main'

import { ApiErrorModule, PaginationModule, S3Module, TokenModule } from '@modules/common'

@Module({
  imports: [TypeOrmModule.forFeature([Character]), S3Module, TokenModule, PaginationModule, ApiErrorModule],
  controllers: [CharacterController],
  providers: [CharacterService, CharacterRepository, CharacterException]
})
export class CharacterModule {}
