export interface UserBeforeAuthentication {
  readonly email: string
  readonly username?: string
  readonly password?: string
  readonly auth_type: string
  readonly photo?: string
  readonly is_verified: boolean
  readonly verify_link?: string
}
