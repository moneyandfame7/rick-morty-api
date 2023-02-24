import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, JoinTable, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './user.entity'

@Entity('roles')
export class Role {
  @ApiProperty({ example: 1, description: 'Autogenerated primary id' })
  @PrimaryGeneratedColumn()
  public id: number

  @ApiProperty({ example: 'admin', description: 'The role of the user.' })
  @Column()
  public value: string

  @OneToMany(() => User, user => user.role)
  @JoinTable()
  public users?: User[]
}
