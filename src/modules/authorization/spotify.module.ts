import { forwardRef, Module } from '@nestjs/common'

import { SpotifyController } from '@app/controllers/authorization'
import { SpotifyService } from '@app/services/authorization'

import { EnvironmentConfigModule, TokenModule, UserModule } from '@modules/common'
import { AuthModule } from '@modules/authorization'

@Module({
  imports: [AuthModule, EnvironmentConfigModule, forwardRef(() => UserModule), TokenModule],
  controllers: [SpotifyController],
  providers: [SpotifyService],
  exports: [SpotifyService]
})
export class SpotifyModule {}
