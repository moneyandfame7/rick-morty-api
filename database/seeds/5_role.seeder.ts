import { DataSource } from 'typeorm'
import { Seeder } from 'typeorm-extension'
import { Role } from '@infrastructure/entities/common/role.entity'

export class RoleSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    try {
      const roleRepository = dataSource.getRepository(Role)

      const roles: Role[] = [
        { id: 1, value: 'user' },
        { id: 2, value: 'admin' }
      ]
      await roleRepository.insert(roles)
      console.log('✅ Roles filling successfully. ')
    } catch (error) {
      console.log('❌ Roles filling failed ')
    }
  }
}
