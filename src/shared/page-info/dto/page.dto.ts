import { IsArray } from 'class-validator'
import { PageInfoDto } from './page-info.dto'

export class PageDto<T> {
  readonly info: PageInfoDto

  @IsArray()
  readonly data: Array<T>

  constructor(data: Array<T>, info: PageInfoDto) {
    this.info = info
    this.data = data
  }
}
