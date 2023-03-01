import { HttpException, HttpStatus, Injectable } from '@nestjs/common'

@Injectable()
export class ApiErrorService {
  public throwErrorResponse(key: string, error: string, status: HttpStatus): HttpException {
    const errorResponse = {
      errors: {}
    }
    errorResponse.errors[key] = error
    return new HttpException(errorResponse, status)
  }
}
