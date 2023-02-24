import { Module } from '@nestjs/common'
import { ApiErrorService } from '@services/common/api-error.service'

@Module({
  imports: [],
  providers: [ApiErrorService],
  exports: [ApiErrorService]
})
export class ApiErrorModule {}
