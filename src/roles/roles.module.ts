import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RolesService } from './roles.service'
import { RolesController } from './roles.controller'
import { Role } from './entities/role.entity'
import { RolesRepository } from './roles.repository'

@Module({
  controllers: [RolesController],
  providers: [RolesService, RolesRepository],
  imports: [TypeOrmModule.forFeature([Role])],
  exports: [RolesService]
})
export class RolesModule {}
