import type { Role } from '@infrastructure/entities/common'

export interface AuthResponse {
  readonly refresh_token: string
  readonly access_token: string
  readonly user: JwtPayload
}

export interface AuthorizationTokens {
  readonly refresh_token: string
  readonly access_token: string
}

export interface JwtPayload {
  readonly id: string
  readonly email: string
  readonly username: string | null
  readonly auth_type: string
  readonly banned: boolean
  readonly role: Role
  readonly country: string | null
  readonly photo: string | null
  readonly mail_subscribe: boolean | null
}

export interface TempJwtPayload {
  readonly id: string
  readonly email: string
  readonly username: string
}
