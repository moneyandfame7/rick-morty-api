import { Module } from '@nestjs/common'
import { UserService } from '../../services/common/user.service'
import { UserController } from '../../controllers/common/user.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Character } from '../../entities/main/character.entity'
import { UserRepository } from '../../repositories/common/user.repository'
import { RolesModule } from './roles.module'
import { TokenModule } from './token.module'

@Module({
  imports: [TypeOrmModule.forFeature([Character]), RolesModule, TokenModule],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService]
})
export class UserModule {}
