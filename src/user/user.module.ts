import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Character } from '../character/entities/character.entity'
import { UserRepository } from './user.repository'
import { RolesModule } from '../roles/roles.module'
import { TokenModule } from '../token/token.module'

@Module({
  imports: [TypeOrmModule.forFeature([Character]), RolesModule, TokenModule],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService]
})
export class UserModule {}
