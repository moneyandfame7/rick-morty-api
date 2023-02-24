import { Module } from '@nestjs/common'
import { AuthModule } from './auth.module'

import { GoogleController } from '@app/controllers/auth/google.controller'
import { GoogleService } from '@app/services/auth/google.service'

import { EnvironmentConfigModule } from '@modules/common/environment-config.module'

import { UserModule } from '@modules/common/user.module'
import { TokenModule } from '@modules/common/token.module'

@Module({
  imports: [AuthModule, EnvironmentConfigModule, UserModule, TokenModule],
  controllers: [GoogleController],
  providers: [GoogleService],
  exports: [GoogleService]
})
export class GoogleModule {}
