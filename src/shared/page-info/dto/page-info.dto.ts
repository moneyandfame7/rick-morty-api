import { PageInfoParametersDto } from '../interfaces/page-info-parameters.dto'
import { HttpException, HttpStatus } from '@nestjs/common'
import * as _ from 'lodash'

export class PageInfoDto {
  readonly page: number

  readonly take: number

  readonly count: number

  readonly pages: number

  readonly prev: string

  readonly next: string
  constructor({ pageOptionsDto, count }: PageInfoParametersDto) {
    const otherQuery = pageOptionsDto.otherQuery
    const queryString = (newPage: number) => _.replace(otherQuery as string, `?page=${this.page}`, `?page=${newPage}`)
    this.page = pageOptionsDto.page
    this.take = pageOptionsDto.take
    this.count = count
    this.pages = Math.ceil(this.count / this.take)
    this.prev = this.page - 1 ? process.env.BASE_URL + queryString(this.page - 1) : null
    this.next = this.page < this.pages ? process.env.BASE_URL + queryString(this.page + 1) : null
    if (this.page > this.pages) {
      throw new HttpException('This page does not exist.', HttpStatus.BAD_REQUEST)
    }
  }
}
