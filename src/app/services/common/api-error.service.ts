import {HttpException, HttpStatus, Injectable} from "@nestjs/common";

@Injectable()
export class ApiErrorService {
    public throwErrorResponse(error: string, status: HttpStatus): HttpException {
        return new HttpException(error, status);
    }

    public throwDemo(code: HttpStatus, stack: string, message: string): HttpException {
        const errorResponse = {
            stack,
            message,
            code,
        };
        return new HttpException(errorResponse, code);
    }
}
