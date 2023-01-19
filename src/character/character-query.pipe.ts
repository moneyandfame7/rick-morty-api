import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common'
import { QueryCharacterDto } from './dto/query-character.dto'
import { plainToInstance } from 'class-transformer'
import { ILike, In } from 'typeorm'
import * as _ from 'lodash'

@Injectable()
export class CharacterQueryPipe implements PipeTransform {
  async transform(value: QueryCharacterDto, metadata: ArgumentMetadata): Promise<any> {
    const object = plainToInstance(metadata.metatype, value)
    return {
      where: _.omitBy(
        {
          id: _.compact(object.id).length ? In(_.compact(object.id)) : null,
          name: value.name ? ILike(`%${value.name}%`) : null,
          status: value.status ? ILike(`%${value.status}%`) : null,
          species: value.species ? ILike(`%${value.species}%`) : null,
          gender: value.gender ? ILike(`%${value.gender}%`) : null,
          type: value.type ? ILike(`%${value.type}%`) : null,
          episodes: value.episode_name
            ? {
                name: ILike(`${value.episode_name}%`)
              }
            : null
        },
        _.isNil
      ),
      take: object.take,
      skip: object.page * object.take - object.take,
      order: {
        id: object.order
      }
    }
  }
}
