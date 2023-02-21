import { Module } from '@nestjs/common'
import { AuthModule } from './auth.module'
import { EnvironmentConfigModule } from '@config/environment-config.module'
import { GithubController } from '@controllers/auth/github.controller'
import { GithubService } from '@services/auth/github.service'
import { UserModule } from '@modules/common/user.module'

@Module({
  imports: [AuthModule, EnvironmentConfigModule, UserModule],
  controllers: [GithubController],
  providers: [GithubService],
  exports: [GithubService]
})
export class GithubModule {}
