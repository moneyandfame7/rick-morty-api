import { User } from '@infrastructure/entities/common'

export interface UserBeforeAuthentication {
  readonly email: string
  username?: string
  readonly password?: string
  readonly auth_type: string
  readonly photo?: string
  readonly is_verified: boolean
  readonly verify_link?: string
}

export interface GetManyUsers {
  readonly users: User[]

  readonly count: number
}

export interface UserStatistics {
  authStats: Array<{
    auth_type: string
  }>
  userCount: number
  verifiedStats: Array<{
    count: string
    verified: boolean
  }>
}

export interface RecentUsers {
  id: string
  created_at: Date
  username: string
  country: string
  is_verified: boolean
  role: string
  photo: string
}

export type UpdateUser = Partial<User>
