import { Module } from '@nestjs/common'

import { AuthModule } from './auth.module'
import { SpotifyService } from '@app/services/auth/spotify.service'
import { SpotifyController } from '@app/controllers/auth/spotify.controller'

import { EnvironmentConfigModule } from '@modules/common/environment-config.module'

import { UserModule } from '@modules/common/user.module'
import { TokenModule } from '@modules/common/token.module'

@Module({
  imports: [AuthModule, EnvironmentConfigModule, UserModule, TokenModule],
  controllers: [SpotifyController],
  providers: [SpotifyService],
  exports: [SpotifyService]
})
export class SpotifyModule {}
