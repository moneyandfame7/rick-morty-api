import {type HttpException, HttpStatus, Injectable} from "@nestjs/common";

import {ApiErrorService} from "@app/services/common";
import {HttpStack} from "@common/constants";

@Injectable()
export class AuthorizationException {
    public constructor(private readonly apiErrorService: ApiErrorService) {
    }

    public incorrectEmail(): HttpException {
        return this.apiErrorService.throwDemo(HttpStatus.BAD_REQUEST, HttpStack.EMAIL_NOT_FOUND, "Couldn’t find your account");
    }

    public incorrectPassword(): HttpException {
        return this.apiErrorService.throwDemo(HttpStatus.BAD_REQUEST, HttpStack.INCORRECT_PASSWORD, `Incorrect password.`);
    }

    public alreadyUsedEmail(): HttpException {
        return this.apiErrorService.throwDemo(HttpStatus.BAD_REQUEST, HttpStack.EMAIL_ALREADY_USED, `That email is taken. Try another.`);
    }

    public incorrectVerificationLink(): HttpException {
        return this.apiErrorService.throwErrorResponse("Invalid verification link", HttpStatus.BAD_REQUEST);
    }

    public alreadyVerified(): HttpException {
        return this.apiErrorService.throwErrorResponse("Already verified", HttpStatus.BAD_REQUEST);
    }

    public passwordIsEqualToOld(): HttpException {
        return this.apiErrorService.throwDemo(HttpStatus.BAD_REQUEST, HttpStack.PASSWORD_IS_EQUAL_OLD, `Password is equal to old password`);
    }

    public passwordsDontMatch(): HttpException {
        return this.apiErrorService.throwErrorResponse("Passwords don't match", HttpStatus.BAD_REQUEST);
    }

    public tokenExpired(): HttpException {
        return this.apiErrorService.throwDemo(HttpStatus.BAD_REQUEST, HttpStack.TOKEN_EXPIRED, 'The time to reset the password has expired. Please try again')
    }

    public invalidToken(): HttpException {
        return this.apiErrorService.throwDemo(HttpStatus.BAD_REQUEST, HttpStack.INVALID_TOKEN, 'Invalid token')
    }
}
