import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RolesService } from '../../services/common/roles.service'
import { RolesController } from '../../controllers/common/roles.controller'
import { Role } from '../../entities/common/role.entity'
import { RolesRepository } from '../../repositories/common/roles.repository'
import { TokenModule } from './token.module'

@Module({
  imports: [TypeOrmModule.forFeature([Role]), TokenModule],
  providers: [RolesService, RolesRepository],
  controllers: [RolesController],
  exports: [RolesService]
})
export class RolesModule {}
