import {BadRequestException, Injectable} from '@nestjs/common'

import {PaginationService} from '@app/services/common'
import {CreateEpisodeDto, QueryEpisodeDto, UpdateEpisodeDto} from '@app/dto/main'
import {QueryPaginationDto} from '@app/dto/common'

import {Episode} from '@infrastructure/entities/main'
import {EpisodeRepository} from '@infrastructure/repositories/main'

import type {BaseService} from '@core/services/main'
import type {Presenter} from '@core/services/common'

import {EpisodeException} from '@common/exceptions/main'
import {objectFromArray} from "@common/utils/objectFromArray";

@Injectable()
export class EpisodeService implements BaseService<Episode, CreateEpisodeDto, UpdateEpisodeDto, QueryEpisodeDto> {
    public constructor(
        private readonly episodeRepository: EpisodeRepository,
        private readonly paginationService: PaginationService<Episode>,
        private readonly episodesException: EpisodeException
    ) {
    }

    public async createOne(createEpisodeDto: CreateEpisodeDto): Promise<Episode> {
        const exists = await this.episodeRepository.findOneBy({name: createEpisodeDto.name})
        if (exists) {
            throw this.episodesException.alreadyExists(exists.name)
        }

        const episode = this.episodeRepository.create(createEpisodeDto)
        return this.episodeRepository.save(episode)
    }

    public getNameList(name:string): Promise<string[]> {
        return this.episodeRepository.getNameList(name)
    }

    public async getUniqueByFields(fields: string[]): Promise<{ [field: string]: string[] }> {
        if (!fields) {
            throw new BadRequestException()
        } else {
            const promises = fields.map(field => this.episodeRepository.getByField(field))
            const values = await Promise.all(promises)

            return objectFromArray(fields, values)
        }
    }


    public async getMany(queryPaginationDto: QueryPaginationDto, queryEpisodeDto: QueryEpisodeDto): Promise<Presenter<Episode>> {
        const {episodes, count} = await this.episodeRepository.getMany(queryPaginationDto, queryEpisodeDto)

        if (!count || !episodes) {
            throw this.episodesException.manyNotFound()
        }
        const buildPaginationInfo = this.paginationService.buildPaginationInfo({queryPaginationDto, count})

        return this.paginationService.wrapEntityWithPaginationInfo(episodes, buildPaginationInfo)
    }

    public async getOne(id: number): Promise<Episode> {
        const episode = await this.episodeRepository.getOne(id)

        if (!episode) {
            throw this.episodesException.withIdNotFound(id)
        }

        return episode
    }

    public async updateOne(id: number, updateEpisodeDto: Partial<UpdateEpisodeDto>): Promise<Episode> {
        const episode = await this.episodeRepository.getOne(id)

        if (!episode) {
            throw this.episodesException.withIdNotFound(id)
        }

        return this.episodeRepository.updateOne(id, updateEpisodeDto)
    }

    public async removeOne(id: number): Promise<Episode> {
        const episode = await this.episodeRepository.getOne(id)

        if (!episode) {
            throw this.episodesException.withIdNotFound(id)
        }

        return this.episodeRepository.removeOne(id)
    }

    public async getCount(): Promise<number> {
        return this.episodeRepository.getCount()
    }
}
