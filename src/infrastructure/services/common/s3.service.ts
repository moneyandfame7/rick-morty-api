import { Injectable } from '@nestjs/common'
import { PutObjectCommand, PutObjectCommandInput, S3Client } from '@aws-sdk/client-s3'
import { EnvironmentConfigService } from '../../config/environment-config.service'

@Injectable()
export class S3Service {
  public readonly s3: S3Client
  public readonly bucketName: string
  private readonly bucketUrl: string

  constructor(private config: EnvironmentConfigService) {
    this.s3 = new S3Client({
      credentials: {
        accessKeyId: config.getS3BucketAccessKey(),
        secretAccessKey: config.getS3BucketAccessSecret()
      },
      region: config.getS3BucketRegion()
    })
    this.bucketName = config.getS3BucketName()
    this.bucketUrl = config.getS3BucketUrl()
  }

  public async upload(params: PutObjectCommandInput) {
    const command = new PutObjectCommand(params)
    return await this.s3.send(command).then(() => `${this.bucketUrl}/${params.Key}`)
  }
}
