import { Module } from '@nestjs/common'
import { CharacterService } from './character.service'
import { CharacterController } from './character.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Character } from './entities/character.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Character])],
  controllers: [CharacterController],
  providers: [CharacterService]
})
export class CharacterModule {}
