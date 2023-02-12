import { Module } from '@nestjs/common'
import { AuthModule } from './auth.module'
import { EnvironmentConfigModule } from '../../config/environment-config.module'
import { GoogleController } from '../../controllers/auth/google.controller'
import { GoogleService } from '../../services/auth/google.service'

@Module({
  imports: [AuthModule, EnvironmentConfigModule],
  controllers: [GoogleController],
  providers: [GoogleService],
  exports: [GoogleService]
})
export class GoogleModule {}
