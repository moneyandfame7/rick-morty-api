import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Character } from 'src/character/entities/character.entity'

@Entity('episodes')
export class Episode {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  episode: string

  @Column({ name: 'air_date' })
  airDate: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @ManyToMany(() => Character, character => character.episodes)
  characters: Character[]
}
