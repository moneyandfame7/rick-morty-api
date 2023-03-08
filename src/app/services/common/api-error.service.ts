import { HttpException, HttpStatus, Injectable } from '@nestjs/common'

@Injectable()
export class ApiErrorService {
  public throwErrorResponse(error: string, status: HttpStatus): HttpException {
    return new HttpException(error, status)
  }
}
