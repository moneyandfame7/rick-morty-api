import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { LocationService } from '../../services/main/location.service'
import { LocationController } from '../../controllers/main/location.controller'
import { Location } from '../../entities/main/location.entity'
import { LocationRepository } from '../../repositories/main/location.repository'
import { TokenModule } from '../common/token.module'
import { PaginationModule } from '../common/pagination.module'

@Module({
  imports: [TypeOrmModule.forFeature([Location]), TokenModule, PaginationModule],
  controllers: [LocationController],
  providers: [LocationService, LocationRepository]
})
export class LocationModule {}
