import { Module } from '@nestjs/common'
import { EnvironmentConfigModule } from '@config/environment-config.module'
import { PaginationService } from '@services/common/pagination.service'
import { ApiErrorModule } from '@modules/common/api-error.module'

@Module({
  imports: [EnvironmentConfigModule, ApiErrorModule],
  providers: [PaginationService],
  exports: [PaginationService]
})
export class PaginationModule {}
