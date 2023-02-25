import { Module } from '@nestjs/common'

import { ApiErrorService } from '@app/services/common'

@Module({
  imports: [],
  providers: [ApiErrorService],
  exports: [ApiErrorService]
})
export class ApiErrorModule {}
