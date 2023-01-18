import * as _ from 'lodash'
import { Pagination } from '../types/filters'
import { Character } from '../character/entities/character.entity'
import { Episode } from '../episode/entities/episode.entity'
import { Location } from '../location/entities/location.entity'

type PossibleData = Character[] | Location[] | Episode[]

export const pagination = (options: Pagination, data: PossibleData, entityName: string) => {
  const maxLimit = 20
  const page = options.page
  const take = options?.take || maxLimit
  const pages = Math.ceil(options.count / take)
  const prev = options.page === 1 ? null : options.page - 1
  const next = options.page === pages ? null : options.page + 1
  // todo зробити валідацію на кількість сторінок і take і т.д
  const queryString = (newPage: number) => _.replace(options.otherQuery as string, `?page=${page}`, `?page=${newPage}`)

  return {
    info: {
      current: options.page,
      count: options.count,
      pages,
      prev: prev
        ? `localhost/${
            options.otherQuery === `/api/${entityName}` ? `/api/${entityName}?page=${prev}` : queryString(prev)
          }`
        : null,
      next: next
        ? `localhost/${
            options.otherQuery === `/api/${entityName}` ? `/api/${entityName}?page=${next}` : queryString(next)
          }`
        : null,
      take
    },
    data: data
  }
}
