import { Role } from '@infrastructure/entities/common'

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
  role: string
  photo: string
}
