export interface UserBeforeAuthentication {
  readonly email: string
  readonly username: string | null
  readonly password: string | null
  readonly auth_type: string
  readonly photo: string | null
  readonly is_verified: boolean
}
