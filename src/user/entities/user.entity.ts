import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { Role } from '../../roles/entities/role.entity'

@Entity('users')
export class User {
  @ApiProperty({ example: '601d90d0-8611-502d-b49b-86c0779b6159', description: 'Autogenerated UUID id' })
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ApiProperty({ example: 'User_228', description: 'The username of the user' })
  @Column({ nullable: false, type: 'varchar', unique: true })
  username: string

  @ApiProperty({ example: 'user@gmail.com', description: 'The email of the user' })
  @Column({ nullable: false, type: 'varchar' })
  email: string

  @ApiProperty({ example: 'user@gmail.com', description: 'The email of the user' })
  @Column({ nullable: true, type: 'varchar' })
  password: string

  @ApiProperty({ example: 'admin', description: 'The role of the user' })
  @ManyToOne(() => Role, role => role.value)
  role: Role

  @ApiProperty({ example: false, description: 'The ban status of the user' })
  @Column({ type: 'boolean', default: false })
  banned: boolean

  @ApiProperty({ example: 'violation', description: 'The ban reason of the user' })
  @Column({ type: 'varchar', nullable: true })
  banReason: string

  @Column({ name: 'auth_type', type: 'varchar', nullable: false })
  // 'google', 'discord', 'instagram', 'github', 'jwt'
  // maybe зробити просто isJwtAuthType: boolean і через це робити
  authType: string

  @Column({ nullable: true })
  photo?: string
}
