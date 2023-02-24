import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { LocationService } from '@app/services/main/location.service'
import { LocationController } from '@app/controllers/main/location.controller'

import { LocationRepository } from '@infrastructure/repositories/main/location.repository'
import { Location } from '@infrastructure/entities/main/location.entity'

import { LocationException } from '@common/exceptions/main/location.exception'

import { TokenModule } from '@modules/common/token.module'
import { PaginationModule } from '@modules/common/pagination.module'
import { ApiErrorModule } from '@modules/common/api-error.module'

@Module({
  imports: [TypeOrmModule.forFeature([Location]), TokenModule, PaginationModule, ApiErrorModule],
  controllers: [LocationController],
  providers: [LocationService, LocationRepository, LocationException]
})
export class LocationModule {}
