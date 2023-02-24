import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './user.entity'

@Entity('tokens')
export class Token {
  @PrimaryGeneratedColumn('increment')
  public id: number

  @OneToOne(() => User, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  public user_id: string

  @Column({ nullable: false })
  public refresh_token: string
}
