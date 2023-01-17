import { Repository } from 'typeorm'
import { Character } from './entities/character.entity'

export class CharacterRepository extends Repository<Character> {}
