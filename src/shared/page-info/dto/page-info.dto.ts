import 'dotenv/config'
import { PageInfoParametersDto } from '../interfaces/page-info-parameters.dto'
import { BadRequestException } from '@nestjs/common'

export class PageInfoDto {
  readonly page: number

  readonly take: number

  readonly count: number

  readonly pages: number

  readonly prev: string

  readonly next: string

  readonly test: any

  private queryString = (query: string, current: number, page: number, endpoint: string) => {
    return query.includes('page') ? process.env.BASE_URL + '/api/' + query.replace(`page=${current}`, `page=${page}`) : process.env.BASE_URL + '/api/' + endpoint + `?page=${page}`
  }

  constructor({ pageOptionsDto, count }: PageInfoParametersDto) {
    this.page = pageOptionsDto.page
    this.take = pageOptionsDto.take
    this.count = count
    this.pages = Math.ceil(this.count / this.take)
    this.prev = this.page - 1 ? this.queryString(pageOptionsDto.otherQuery, this.page, this.page - 1, pageOptionsDto.endpoint) : null
    this.next = this.page < this.pages ? this.queryString(pageOptionsDto.otherQuery, this.page, this.page + 1, pageOptionsDto.endpoint) : null
    if (this.page > this.pages) throw new BadRequestException('No such page exists')
  }
}
