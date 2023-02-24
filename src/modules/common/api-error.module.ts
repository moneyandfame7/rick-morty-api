import { Module } from '@nestjs/common'

import { ApiErrorService } from '@app/services/common/api-error.service'

@Module({
  imports: [],
  providers: [ApiErrorService],
  exports: [ApiErrorService]
})
export class ApiErrorModule {}
