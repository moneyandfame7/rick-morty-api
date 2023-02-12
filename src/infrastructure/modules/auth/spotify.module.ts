import { Module } from '@nestjs/common'
import { AuthModule } from './auth.module'
import { EnvironmentConfigModule } from '../../config/environment-config.module'
import { SpotifyService } from '../../services/auth/spotify.service'
import { SpotifyController } from '../../controllers/auth/spotify.controller'

@Module({
  imports: [AuthModule, EnvironmentConfigModule],
  controllers: [SpotifyController],
  providers: [SpotifyService],
  exports: [SpotifyService]
})
export class SpotifyModule {}
