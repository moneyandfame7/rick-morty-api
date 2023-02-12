import { Module } from '@nestjs/common'
import { S3Service } from '../../services/common/s3.service'
import { EnvironmentConfigModule } from '../../config/environment-config.module'

@Module({
  imports: [EnvironmentConfigModule],
  providers: [S3Service],
  exports: [S3Service]
})
export class S3Module {}
