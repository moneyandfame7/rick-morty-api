import type { User } from '@entities/common/user.entity'

export interface AuthTokensWithUser {
  readonly refresh_token: string
  readonly access_token: string
  user: User
}

export interface AuthRedirect {
  readonly url: string
}
