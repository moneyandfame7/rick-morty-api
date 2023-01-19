import { PageInfoParametersDto } from '../interfaces/page-info-parameters.dto'

export class PageInfoDto {
  readonly page: number

  readonly take: number

  readonly count: number

  readonly pages: number

  readonly hasPreviousPage: boolean

  readonly hasNextPage: boolean

  constructor({ pageOptionsDto, count }: PageInfoParametersDto) {
    this.page = pageOptionsDto.page
    this.take = pageOptionsDto.take
    this.count = count
    this.pages = Math.ceil(this.count / this.take)
    this.hasPreviousPage = this.page > 1
    this.hasNextPage = this.page < this.pages
  }
}
