import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from '../../user/entities/user.entity'

@Entity('tokens')
export class Token {
  @PrimaryGeneratedColumn('increment')
  id: number

  @OneToOne(() => User, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user_id: string

  @Column({ nullable: false })
  refreshToken: string
}
