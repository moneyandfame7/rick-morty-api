import type { Role } from '@infrastructure/entities/common/role.entity'

export interface AuthTokens {
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
  readonly mail_subscribe: boolean | null
}

export interface TempJwtPayload {
  readonly id: string
  readonly email: string
  readonly username: string
}
