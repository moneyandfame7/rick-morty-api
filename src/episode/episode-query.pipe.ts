import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { ILike, In } from 'typeorm'
import * as _ from 'lodash'
import { QueryEpisodeDto } from './dto/query-episode.dto'

@Injectable()
export class EpisodeQueryPipe implements PipeTransform {
  async transform(value: QueryEpisodeDto, metadata: ArgumentMetadata): Promise<any> {
    const object = plainToInstance(metadata.metatype, value)

    return {
      where: _.omitBy(
        {
          id: _.compact(object.id).length ? In(_.compact(object.id)) : null,
          name: value.name ? ILike(`%${value.name}%`) : null,
          type: value.type ? ILike(`%${value.type}%`) : null,
          characters: value.character_name
            ? {
                name: ILike(`${value.character_name}%`)
              }
            : null
        },
        _.isNil
      ),
      take: object.take,
      skip: object.page * object.take - object.take
    }
  }
}
