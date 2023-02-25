import { Injectable } from '@nestjs/common'

import { EnvironmentConfigService } from '@app/services/common'

import type { BuildPaginationOptions, PaginationOptions, Presenter } from '@core/services/common'

import { PaginationException } from '@common/exceptions/common'

@Injectable()
export class PaginationService<Entity> {
  public constructor(private readonly config: EnvironmentConfigService, private readonly paginationException: PaginationException) {}

  private queryString(query: string | undefined, current: number, page: number, endpoint: string): string | null {
    if (!query) {
      return this.config.getBaseUrl() + '/api/' + endpoint + `?page=${page}`
    }
    return query.includes('page')
      ? this.config.getBaseUrl() + '/api/' + endpoint + query.replace(`page=${current}`, `?page=${page}`)
      : this.config.getBaseUrl() + '/api/' + endpoint + `?page=${page}&` + query
  }

  public buildPaginationInfo({ queryPaginationDto, count }: PaginationOptions): BuildPaginationOptions {
    const page = queryPaginationDto.page
    const endpoint = queryPaginationDto.endpoint
    const otherQuery = queryPaginationDto.otherQuery
    const take = queryPaginationDto.take
    const pages = Math.ceil(count / take)

    if (page > pages) {
      throw this.paginationException.notFound(page)
    }
    return {
      page,
      take,
      count,
      pages,
      prev: page - 1 ? this.queryString(otherQuery, page, page - 1, endpoint) : null,
      next: page < pages ? this.queryString(otherQuery, page, page + 1, endpoint) : null
    }
  }

  public wrapEntityWithPaginationInfo(results: Entity[], info: BuildPaginationOptions): Presenter<Entity> {
    return {
      info,
      results
    }
  }
}
