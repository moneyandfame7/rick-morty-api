import {Module} from '@nestjs/common'
import {JwtModule} from '@nestjs/jwt'
import {TypeOrmModule} from '@nestjs/typeorm'

import {TokenService} from '@app/services/common'

import {TokenRepository} from '@infrastructure/repositories/common'
import {Token} from '@infrastructure/entities/common'

import {ApiErrorModule, EnvironmentConfigModule} from '@modules/common'
import {AuthorizationException} from "@common/exceptions/authorization";

@Module({
    imports: [TypeOrmModule.forFeature([Token]), JwtModule, EnvironmentConfigModule, ApiErrorModule],
    providers: [TokenService, TokenRepository, AuthorizationException],
    exports: [TokenService]
})
export class TokenModule {
}
