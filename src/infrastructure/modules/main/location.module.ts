import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { LocationService } from '@services/main/location.service'
import { LocationController } from '@controllers/main/location.controller'
import { Location } from '@entities/main/location.entity'
import { LocationRepository } from '@repositories/main/location.repository'
import { TokenModule } from '../common/token.module'
import { PaginationModule } from '../common/pagination.module'
import { ApiErrorModule } from '@modules/common/api-error.module'
import { LocationException } from '@domain/exceptions/main/location.exception'

@Module({
  imports: [TypeOrmModule.forFeature([Location]), TokenModule, PaginationModule, ApiErrorModule],
  controllers: [LocationController],
  providers: [LocationService, LocationRepository, LocationException]
})
export class LocationModule {}
