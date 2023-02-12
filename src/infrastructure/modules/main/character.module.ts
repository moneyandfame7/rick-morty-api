import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { S3Module } from '../common/s3.module'
import { CharacterService } from '../../services/main/character.service'
import { CharacterController } from '../../controllers/main/character.controller'
import { Character } from '../../entities/main/character.entity'
import { CharacterRepository } from '../../repositories/main/character.repository'
import { TokenModule } from '../common/token.module'
import { PaginationModule } from '../common/pagination.module'

@Module({
  imports: [TypeOrmModule.forFeature([Character]), S3Module, TokenModule, PaginationModule],
  controllers: [CharacterController],
  providers: [CharacterService, CharacterRepository]
})
export class CharacterModule {}
