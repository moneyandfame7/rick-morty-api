import { DataSource } from 'typeorm'
import type { Seeder } from 'typeorm-extension'

import { Role } from '@infrastructure/entities/common'

import { RolesEnum } from '@common/constants'

export class RoleSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    try {
      const roleRepository = dataSource.getRepository(Role)

      const roles: Role[] = [
        { id: 1, value: RolesEnum.USER },
        { id: 2, value: RolesEnum.ADMIN },
        { id: 3, value: RolesEnum.OWNER }
      ]
      await roleRepository.insert(roles)
      console.log('✅ Roles filling successfully. ')
    } catch (error) {
      console.log('❌ Roles filling failed ')
    }
  }
}
