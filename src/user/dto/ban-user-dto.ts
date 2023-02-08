import { IsNotEmpty, IsUUID } from 'class-validator'

export class BanUserDto {
  @IsUUID()
  readonly userId: string

  @IsNotEmpty()
  readonly banReason: string
}
