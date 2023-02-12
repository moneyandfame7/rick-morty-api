import { Injectable } from '@nestjs/common'
import { AuthConfig } from '../../domain/config/auth.interface'
import { S3BucketConfig } from '../../domain/config/s3-bucket.interface'
import { DatabaseConfig } from '../../domain/config/database.interface'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class EnvironmentConfigService implements AuthConfig, S3BucketConfig, DatabaseConfig {
  constructor(private readonly configService: ConfigService) {}

  getBaseUrl(): string {
    return this.configService.get<string>('BASE_URL')
  }

  getDatabaseHost(): string {
    return this.configService.get<string>('DB_HOST')
  }
  getDatabaseName(): string {
    return this.configService.get<string>('DB_NAME')
  }
  getDatabasePassword(): string {
    return this.configService.get<string>('DB_PASSWORD')
  }
  getDatabasePort(): number {
    return this.configService.get<number>('DB_PORT')
  }
  getDatabaseUsername(): string {
    return this.configService.get<string>('DB_USERNAME')
  }

  getS3BucketAccessKey(): string {
    return this.configService.get<string>('S3BUCKET_ACCESS_KEY')
  }
  getS3BucketAccessSecret(): string {
    return this.configService.get<string>('S3BUCKET_ACCESS_SECRET')
  }
  getS3BucketName(): string {
    return this.configService.get<string>('S3BUCKET_NAME')
  }
  getS3BucketRegion(): string {
    return this.configService.get<string>('S3BUCKET_REGION')
  }
  getS3BucketUrl(): string {
    return this.configService.get<string>('S3BUCKET_URL')
  }

  getJwtAccessCookie(): string {
    return this.configService.get<string>('JWT_ACCESS_COOKIE')
  }
  getJwtAccessSecret(): string {
    return this.configService.get<string>('JWT_ACCESS_SECRET')
  }
  getJwtRefreshCookie(): string {
    return this.configService.get<string>('JWT_REFRESH_COOKIE')
  }
  getJwtRefreshSecret(): string {
    return this.configService.get<string>('JWT_REFRESH_SECRET')
  }

  getGoogleCallbackUrl(): string {
    return this.configService.get<string>('GOOGLE_CALLBACK_URL')
  }
  getGoogleClientId(): string {
    return this.configService.get<string>('GOOGLE_CLIENT_ID')
  }
  getGoogleClientSecret(): string {
    return this.configService.get<string>('GOOGLE_CLIENT_SECRET')
  }

  getDiscordCallbackUrl(): string {
    return this.configService.get<string>('DISCORD_CALLBACK_URL')
  }
  getDiscordClientId(): string {
    return this.configService.get<string>('DISCORD_CLIENT_ID')
  }
  getDiscordClientSecret(): string {
    return this.configService.get<string>('DISCORD_CLIENT_SECRET')
  }

  getGithubCallbackUrl(): string {
    return this.configService.get<string>('GITHUB_CALLBACK_URL')
  }
  getGithubClientId(): string {
    return this.configService.get<string>('GITHUB_CLIENT_ID')
  }
  getGithubClientSecret(): string {
    return this.configService.get<string>('GITHUB_CLIENT_SECRET')
  }

  getSpotifyCallbackUrl(): string {
    return this.configService.get<string>('SPOTIFY_CALLBACK_URL')
  }
  getSpotifyClientId(): string {
    return this.configService.get<string>('SPOTIFY_CLIENT_ID')
  }
  getSpotifyClientSecret(): string {
    return this.configService.get<string>('SPOTIFY_CLIENT_SECRET')
  }
}
