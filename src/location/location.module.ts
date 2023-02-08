import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { LocationService } from './location.service'
import { LocationController } from './location.controller'
import { Location } from './entities/location.entity'
import { LocationRepository } from './location.repository'
import { TokenModule } from '../token/token.module'

@Module({
  imports: [TypeOrmModule.forFeature([Location]), TokenModule],
  controllers: [LocationController],
  providers: [LocationService, LocationRepository]
})
export class LocationModule {}
