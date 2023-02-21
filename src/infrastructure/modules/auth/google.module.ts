import { Module } from '@nestjs/common'
import { AuthModule } from './auth.module'
import { EnvironmentConfigModule } from '../../config/environment-config.module'
import { GoogleController } from '../../controllers/auth/google.controller'
import { GoogleService } from '../../services/auth/google.service'
import { UserModule } from '@modules/common/user.module'

@Module({
  imports: [AuthModule, EnvironmentConfigModule, UserModule],
  controllers: [GoogleController],
  providers: [GoogleService],
  exports: [GoogleService]
})
export class GoogleModule {}
