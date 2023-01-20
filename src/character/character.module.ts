import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CharacterService } from './character.service'
import { CharacterController } from './character.controller'
import { Character } from './entities/character.entity'
import { S3Module } from '../s3/s3.module'

@Module({
  imports: [TypeOrmModule.forFeature([Character]), S3Module],
  controllers: [CharacterController],
  providers: [CharacterService]
})
export class CharacterModule {}
