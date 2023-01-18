import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Character } from 'src/character/entities/character.entity'

@Entity('episodes')
export class Episode {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column()
  name: string

  @Column()
  episode: string

  @Column({ name: 'air_date', select: false })
  airDate: string

  @CreateDateColumn({ name: 'created_at', select: false })
  createdAt: Date

  @ManyToMany(() => Character, character => character.episodes, { onDelete: 'CASCADE' })
  characters: Character[]
}
