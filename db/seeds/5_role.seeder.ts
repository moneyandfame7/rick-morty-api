import type { DataSource } from 'typeorm'
import type { Seeder } from 'typeorm-extension'
import { Role } from 'src/infrastructure/entities/common/role.entity'

export class RoleSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    try {
      const roleRepository = dataSource.getRepository(Role)

      const roles: Role[] = [
        { id: 1, value: 'admin' },
        { id: 2, value: 'user' }
      ]
      await roleRepository.insert(roles)
      console.log('✅ Roles filling successfully. ')
    } catch (error) {
      console.log('❌ Roles filling failed ')
    }
  }
}
