import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import * as _ from 'lodash'
import { QueryCharacterDto } from './dto/query-character.dto'
import { toCorrectId } from '../shared/transforms/to-correct-id.transform'

export const CharacterDecorator = createParamDecorator(
  (data: string[], ctx: ExecutionContext): Partial<QueryCharacterDto> => {
    const request = ctx.switchToHttp().getRequest()
    console.log(request.query)
    console.log(data)

    const characterQuery: Partial<QueryCharacterDto> = {}
    _.forIn(request.query, (value, key) => {
      for (const field of data) {
        if (key === field) {
          characterQuery[key] = value
        }
      }
    })
    characterQuery.id ? (characterQuery.id = toCorrectId(characterQuery.id as any)) : null

    console.log(characterQuery, ' <<<< characters query decorator')
    return characterQuery
  }
)
