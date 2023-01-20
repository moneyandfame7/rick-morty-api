import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PutObjectCommand, PutObjectCommandInput, S3Client } from '@aws-sdk/client-s3'

@Injectable()
export class S3Service {
  public readonly s3: S3Client
  public readonly bucketName: string
  private readonly bucketUrl: string

  constructor(private configService: ConfigService) {
    this.s3 = new S3Client({
      credentials: {
        accessKeyId: configService.get<string>('ACCESS_KEY'),
        secretAccessKey: configService.get<string>('SECRET_ACCESS_KEY')
      },
      region: configService.get<string>('BUCKET_REGION')
    })
    this.bucketName = configService.get<string>('BUCKET_NAME')
    this.bucketUrl = configService.get<string>('BUCKET_URL')
  }

  /* Uploading image to bucket and return location*/
  public async upload(params: PutObjectCommandInput) {
    const command = new PutObjectCommand(params)
    return await this.s3.send(command).then(() => `${this.bucketUrl}/${params.Key}`)
  }
}
