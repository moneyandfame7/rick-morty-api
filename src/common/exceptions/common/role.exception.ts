import { HttpException, HttpStatus, Injectable } from '@nestjs/common'

import { ApiErrorService } from '@app/services/common'

@Injectable()
export class RolesException {
  public constructor(private readonly apiErrorService: ApiErrorService) {}

  public manyNotFound(): HttpException {
    return this.apiErrorService.throwErrorResponse('roles', 'Roles not found', HttpStatus.NOT_FOUND)
  }

  public withValueNotFound(value: string): HttpException {
    return this.apiErrorService.throwErrorResponse('value', `Role ${value} not found`, HttpStatus.NOT_FOUND)
  }

  public alreadyExists(value: string): HttpException {
    return this.apiErrorService.throwErrorResponse('value', `Role ${value} already exists`, HttpStatus.CONFLICT)
  }
}
