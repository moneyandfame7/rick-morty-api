import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn
} from 'typeorm'
import { Character } from 'src/character/entities/character.entity'

@Entity('episodes')
export class Episode {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  type: string

  @Column()
  episode: string

  @Column()
  air_date: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @ManyToMany(() => Character, character => character.episodes)
  characters: Character[]
}
