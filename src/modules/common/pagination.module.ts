import { Module } from '@nestjs/common'

import { PaginationService } from '@app/services/common'

import { PaginationException } from '@common/exceptions/common'

import { ApiErrorModule, EnvironmentConfigModule } from '@modules/common'

@Module({
  imports: [EnvironmentConfigModule, ApiErrorModule],
  providers: [PaginationService, PaginationException],
  exports: [PaginationService]
})
export class PaginationModule {}
