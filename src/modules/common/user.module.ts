import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserService } from '@app/services/common/user.service'
import { UserController } from '@app/controllers/common/user.controller'

import { UserRepository } from '@infrastructure/repositories/common/user.repository'
import { Character } from '@infrastructure/entities/main/character.entity'

import { RolesModule } from './roles.module'
import { S3Module } from './s3.module'
import { TokenModule } from './token.module'

@Module({
  imports: [TypeOrmModule.forFeature([Character]), RolesModule, TokenModule, S3Module],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService]
})
export class UserModule {}
