import * as _ from 'lodash'
import { PossibleOptions } from '../types/filters'
import { ILike, In } from 'typeorm'

export default function filterData(this: any, options: PossibleOptions, model: string) {
  // const order = { order: [['id', options.order || 'ASC']] }
  const page = options.page || 1
  const take = options.take || 20
  const skip = page * take - take

  const basic = {
    id: In(options.id),
    name: options.name ? ILike(`%${options.name}%`) : undefined
  }
  switch (model) {
    case 'Character':
      return {
        where: _.omitBy(
          {
            ...basic,
            status: options.status,
            species: options.species,
            type: options.type,
            gender: options.gender
          },
          _.isNil
        ),
        // ...order,
        take,
        skip
      }
    case 'Episode':
      return {
        where: _.omitBy(
          {
            ...basic,
            episode: options.episode
          },
          _.isNil
        ),
        // ...order,
        take,
        skip
      }
    case 'Location':
      return {
        where: _.omitBy(
          {
            ...basic,
            type: options.type,
            dimension: options.dimension
          },
          _.isNil
        ),
        // ...order,
        take,
        skip
      }
  }
}
