import { PageInfoParametersDto } from '../interfaces/page-info-parameters.dto'
import { HttpException, HttpStatus } from '@nestjs/common'
import * as _ from 'lodash'
import 'dotenv/config'

export class PageInfoDto {
  readonly page: number

  readonly take: number

  readonly count: number

  readonly pages: number

  readonly prev: string

  readonly next: string

  readonly otherQuery: any

  constructor({ pageOptionsDto, count }: PageInfoParametersDto) {
    this.page = pageOptionsDto.page
    this.take = pageOptionsDto.take
    this.otherQuery = (newPage: string) =>
      process.env.BASE_URL + _.replace(pageOptionsDto.otherQuery, `page=${this.page}`, `page=${newPage}`)

    this.count = count
    this.pages = Math.ceil(this.count / this.take)
    this.prev = this.page - 1 ? this.otherQuery(this.page - 1) : null
    this.next = this.page < this.pages ? this.otherQuery(this.page + 1) : null
  }
}
