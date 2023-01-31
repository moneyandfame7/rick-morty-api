import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Character } from '../character/entities/character.entity'
import { UserRepository } from './user.repository'

@Module({
  imports: [TypeOrmModule.forFeature([Character])],
  controllers: [UserController],
  providers: [UserService, UserRepository]
})
export class UserModule {}
