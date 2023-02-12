import { Module } from '@nestjs/common'
import { EnvironmentConfigModule } from '../../config/environment-config.module'
import { PaginationService } from '../../services/common/pagination.service'

@Module({
  imports: [EnvironmentConfigModule],
  providers: [PaginationService],
  exports: [PaginationService]
})
export class PaginationModule {}
