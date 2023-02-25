import { AuthGuard } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'

import { AUTHORIZATION_PROVIDER } from '@common/constants'

@Injectable()
export class JwtAuthGuard extends AuthGuard(AUTHORIZATION_PROVIDER.JWT) {}
