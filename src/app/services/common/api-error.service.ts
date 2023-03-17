import { HttpException, HttpStatus, Injectable } from '@nestjs/common'

@Injectable()
export class ApiErrorService {
  public throwErrorResponse(error: string, status: HttpStatus): HttpException {
    return new HttpException(error, status)
  }

  public throwDemo(code: string, message: string, status: HttpStatus): HttpException {
    const errorResponse = {
      code,
      message
    }
    return new HttpException(errorResponse, status)
  }
}
