import { ApiProperty } from '@nestjs/swagger'
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Episode } from '@entities/main/episode.entity'
import { Location } from '@entities/main/location.entity'

@Entity('characters')
export class Character {
  @ApiProperty({ example: 1, description: 'Autogenerated primary id' })
  @PrimaryGeneratedColumn()
  public id: number

  @ApiProperty({ example: 'Alive', description: "The status of the character ('Alive', 'Dead' or 'unknown')." })
  @Column()
  public status: string

  @ApiProperty({ example: 'Rick Sanchez', description: 'The name of the character.' })
  @Column()
  public name: string

  @ApiProperty({ example: 'Human', description: 'The species of the character.' })
  @Column()
  public species: string

  @ApiProperty({
    example: 'Human',
    description: "The gender of the character ('Female', 'Male', 'Genderless' or 'unknown')."
  })
  @Column()
  public gender: string

  @ApiProperty({ example: 'Genetic experiment', description: 'The type or subspecies of the character.' })
  @Column()
  public type: string

  @ApiProperty({ description: 'Link to character`s photo.' })
  @Column()
  public image: string

  @ApiProperty({
    example: {
      name: 'Earth (C-137)',
      type: 'Planet',
      dimension: 'Dimension C-137'
    },
    description: "Info to the character's origin location.",
    type: () => Location
  })
  @ManyToOne(() => Location, location => location.residents)
  public location: Location

  @ApiProperty({
    example: {
      name: 'Earth (C-137)',
      type: 'Planet',
      dimension: 'Dimension C-137'
    },
    description: "Info to the character's last known location endpoint.",
    type: () => Location
  })
  @ManyToOne(() => Location, location => location.residents)
  public origin: Location

  @ApiProperty({
    example: [1, 2, 3, 4, 5, 7, 10],
    description: "List of episode's id in which this character appeared."
  })
  @ManyToMany(() => Episode, episode => episode.characters, {
    cascade: true,
    onDelete: 'CASCADE'
  })
  @JoinTable()
  public episodes: Episode[]

  @ApiProperty({
    description: 'Autogenerated date of created.'
  })
  @CreateDateColumn({ name: 'created_at' })
  public createdAt: Date
}
