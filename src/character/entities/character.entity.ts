import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Episode } from 'src/episode/entities/episode.entity'
import { Location } from 'src/location/entities/location.entity'

@Entity('characters')
export class Character {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  status: string

  @Column()
  name: string

  @Column()
  species: string

  @Column()
  gender: string

  @Column()
  type: string

  @Column()
  image: string

  @ManyToOne(() => Location, location => location.residents)
  location: Location

  @ManyToOne(() => Location, location => location.residents)
  origin: Location

  @ManyToMany(() => Episode, episode => episode.characters, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @JoinTable()
  episodes: Episode[]

  @CreateDateColumn({ name: 'created_at', select: false })
  createdAt: Date
}
