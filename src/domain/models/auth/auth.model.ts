import { Role } from '@entities/common/role.entity'

export interface AuthTokensWithUser {
  readonly refresh_token: string
  readonly access_token: string
  payload: JwtPayload
}

export interface AuthRedirect {
  readonly url: string
}

export interface JwtPayload {
  id: string
  email: string
  username: string
  role: Role
}
