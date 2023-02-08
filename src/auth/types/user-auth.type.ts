import { Role } from '../../roles/entities/role.entity'

export interface UserAuthType {
  id: string
  email: string
  role: Role
  iat: number
  exp: number
}
