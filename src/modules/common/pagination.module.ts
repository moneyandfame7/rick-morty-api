import { Module } from '@nestjs/common'

import { PaginationService } from '@app/services/common/pagination.service'

import { EnvironmentConfigModule } from '@modules/common/environment-config.module'

import { ApiErrorModule } from './api-error.module'

@Module({
  imports: [EnvironmentConfigModule, ApiErrorModule],
  providers: [PaginationService],
  exports: [PaginationService]
})
export class PaginationModule {}
