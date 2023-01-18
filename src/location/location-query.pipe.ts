import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { ILike, In } from 'typeorm'
import * as _ from 'lodash'
import { QueryLocationDto } from './dto/query-location.dto'

@Injectable()
export class LocationQueryPipe implements PipeTransform {
  async transform(value: QueryLocationDto, metadata: ArgumentMetadata): Promise<any> {
    const object = plainToInstance(metadata.metatype, value)

    return {
      where: _.omitBy(
        {
          id: _.compact(object.id).length ? In(_.compact(object.id)) : null,
          name: value.name ? ILike(`%${value.name}%`) : null,
          type: value.type ? ILike(`%${value.type}%`) : null,
          dimension: value.dimension ? ILike(`%${value.dimension}%`) : null,
          residents: value.resident_name
            ? {
                name: ILike(`${value.resident_name}%`)
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
