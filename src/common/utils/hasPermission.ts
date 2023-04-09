import { RolesEnum } from '@common/constants'

const privelegedRoles = [RolesEnum.ADMIN as string, RolesEnum.OWNER as string]
export const hasPermission = (role: string): boolean => privelegedRoles.includes(role)
