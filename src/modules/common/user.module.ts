import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserService } from '@app/services/common'
import { UserController } from '@app/controllers/common'

import { UserRepository } from '@infrastructure/repositories/common'
import { Character } from '@infrastructure/entities/main'

import { ApiErrorModule, RolesModule, S3Module, TokenModule } from '@modules/common'
import { UserException } from '@common/exceptions/common'

@Module({
  imports: [TypeOrmModule.forFeature([Character]), RolesModule, forwardRef(() => TokenModule), S3Module, ApiErrorModule],
  controllers: [UserController],
  providers: [UserService, UserRepository, UserException],
  exports: [UserService]
})
export class UserModule {}
