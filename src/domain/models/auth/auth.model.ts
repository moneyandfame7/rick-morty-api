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
  is_verified: boolean
}

export interface TempUserPayload {
  email: string
  password: string | null
  username: string | null
  auth_type: string
  is_verified: boolean
  photo: string | null
}
