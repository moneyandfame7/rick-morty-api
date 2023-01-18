import { Character } from 'src/character/entities/character.entity'
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity('locations')
export class Location {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  type: string

  @Column()
  dimension: string

  @CreateDateColumn({ name: 'created_at', select: false })
  createdAt: Date

  @OneToMany(() => Character, character => character.location)
  residents: Character[]
}
