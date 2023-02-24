import { Module } from '@nestjs/common'
import { EnvironmentConfigService } from '@app/services/common/environment-config.service'

@Module({
  imports: [],
  controllers: [],
  providers: [EnvironmentConfigService],
  exports: [EnvironmentConfigService]
})
export class EnvironmentConfigModule {}
