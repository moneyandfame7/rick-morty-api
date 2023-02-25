import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { RolesService } from '@app/services/common'
import { RolesController } from '@app/controllers/common'

import { Role } from '@infrastructure/entities/common'
import { RolesRepository } from '@infrastructure/repositories/common'

import { RolesException } from '@common/exceptions/common'

import { ApiErrorModule, TokenModule } from '@modules/common'

@Module({
  imports: [TypeOrmModule.forFeature([Role]), forwardRef(() => TokenModule), ApiErrorModule],
  providers: [RolesService, RolesRepository, RolesException],
  controllers: [RolesController],
  exports: [RolesService]
})
export class RolesModule {}
