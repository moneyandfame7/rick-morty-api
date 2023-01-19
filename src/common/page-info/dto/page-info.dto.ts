import { PageInfoParametersDto } from '../interfaces/page-info-parameters.dto'
import { HttpException, HttpStatus } from '@nestjs/common'

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
    if (this.page > this.pages) {
      throw new HttpException('This page does not exist.', HttpStatus.BAD_REQUEST)
    }
  }
}
