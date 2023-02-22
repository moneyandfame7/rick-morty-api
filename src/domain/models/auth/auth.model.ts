export interface AuthTokens {
  readonly refresh_token: string
  readonly access_token: string
}

export interface AuthRedirect {
  readonly url: string
}

export interface JwtPayload {
  id: string
  email: string
  username: string
  auth_type: string
  country: string
  is_verified: boolean
}
