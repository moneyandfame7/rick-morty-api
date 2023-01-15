import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'
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

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @ManyToMany(() => Episode, episode => episode.characters, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @JoinTable()
  episodes: Episode[]

  @ManyToOne(() => Location)
  @JoinColumn({ name: 'locationId' })
  location: Location

  @ManyToOne(() => Location)
  @JoinColumn({ name: 'originId' })
  origin: Location
}
