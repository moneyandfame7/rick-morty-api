import { PassportSerializer } from '@nestjs/passport'
import { UserService } from '../../user/user.service'
import { User } from '../../user/entities/user.entity'
import { Injectable } from '@nestjs/common'

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly userService: UserService) {
    super()
  }

  serializeUser(user: User, done: Function) {
    console.log(user, '<<< SERIALIZE USER')
    done(null, user)
  }

  async deserializeUser(payload: any, done: Function) {
    const user = await this.userService.getOneById(payload.id)
    console.log(user, '<<< DESERIALIZE USER')
    return user ? done(null, user) : done(null, null)
  }
}
