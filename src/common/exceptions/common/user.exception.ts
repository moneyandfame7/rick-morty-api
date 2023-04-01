import {HttpException, HttpStatus, Injectable} from '@nestjs/common'

import {ApiErrorService} from '@app/services/common'
import {HttpStack} from "@common/constants";

@Injectable()
export class UserException {
    public constructor(private readonly apiErrorService: ApiErrorService) {
    }

    public manyNotFound(): HttpException {
        return this.apiErrorService.throwErrorResponse('Users not found', HttpStatus.NOT_FOUND)
    }

    public notFound(): HttpException {
        return this.apiErrorService.throwErrorResponse('User not found', HttpStatus.NOT_FOUND)
    }

    public withIdNotFound(): HttpException {
        return this.apiErrorService.throwDemo(HttpStatus.NOT_FOUND, HttpStack.ID_NOT_FOUND, `User with same id not found`);
    }

    public alreadyExistsWithEmail(email: string): HttpException {
        return this.apiErrorService.throwErrorResponse(`User with email ${email} already exists`, HttpStatus.CONFLICT)
    }

    public alreadyExistsWithUsername(username: string): HttpException {
        return this.apiErrorService.throwErrorResponse(`User with username ${username} already exists`, HttpStatus.CONFLICT)
    }
}
