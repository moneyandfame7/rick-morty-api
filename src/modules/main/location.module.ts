import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { LocationService } from '@app/services/main'
import { LocationController } from '@app/controllers/main'

import { LocationRepository } from '@infrastructure/repositories/main'
import { Location } from '@infrastructure/entities/main'

import { LocationException } from '@common/exceptions/main'

import { ApiErrorModule, PaginationModule, TokenModule } from '@modules/common'

@Module({
  imports: [TypeOrmModule.forFeature([Location]), TokenModule, PaginationModule, ApiErrorModule],
  controllers: [LocationController],
  providers: [LocationService, LocationRepository, LocationException]
})
export class LocationModule {}
