import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { S3Module } from '../s3/s3.module'
import { CharacterService } from './character.service'
import { CharacterController } from './character.controller'
import { Character } from './entities/character.entity'
import { CharacterRepository } from './character.repository'

@Module({
  imports: [TypeOrmModule.forFeature([Character]), S3Module],
  controllers: [CharacterController],
  providers: [CharacterService, CharacterRepository]
})
export class CharacterModule {}
