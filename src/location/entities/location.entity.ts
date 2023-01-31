import { Character } from 'src/character/entities/character.entity'
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'

@Entity('locations')
export class Location {
  @ApiProperty({ example: 1, description: 'The id of the location.' })
  @PrimaryGeneratedColumn()
  id: number

  @ApiProperty({ example: 'Earth (C-137)', description: 'The name of the location.' })
  @Column()
  name: string

  @ApiProperty({ example: 'Planet', description: 'The type of the location.' })
  @Column()
  type: string

  @ApiProperty({ example: 'Dimension C-137', description: 'The dimension in which the location is located.' })
  @Column()
  dimension: string

  @ApiProperty({
    example: [1, 2, 3, 4, 5, 7, 10],
    description: 'List of character`s id who have been last seen in the location.'
  })
  @OneToMany(() => Character, character => character.location)
  residents: Character[]

  @ApiProperty({
    description: 'Autogenerated date of created.'
  })
  @CreateDateColumn({ name: 'created_at', select: false })
  createdAt: Date
}
