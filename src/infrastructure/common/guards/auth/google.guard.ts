import { AuthGuard } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  // async canActivate(context: ExecutionContext) {
  //   const activate = (await super.canActivate(context)) as boolean
  //   const request = context.switchToHttp().getRequest()
  //   console.log(request.isAuthenticated())
  //   await super.logIn(request)
  //
  //   return activate
  // }
}
