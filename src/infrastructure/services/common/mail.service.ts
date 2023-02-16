import { Injectable } from '@nestjs/common'
import * as nodemailer from 'nodemailer'
import { Transporter } from 'nodemailer'
import { EnvironmentConfigService } from '../../config/environment-config.service'
import { UserService } from './user.service'

@Injectable()
export class MailService {
  private readonly transporter: Transporter
  private readonly host: string
  private readonly port: number
  private readonly user: string
  private readonly password: string

  constructor(private config: EnvironmentConfigService, private userService: UserService) {
    this.host = config.getMailerHost()
    this.port = config.getMailerPort()
    this.user = config.getMailerUser()
    this.password = config.getMailerPassword()
    this.transporter = nodemailer.createTransport({
      host: this.host,
      port: this.port,
      secure: false,
      auth: {
        user: config.getMailerUser(),
        pass: config.getMailerPassword()
      }
    })
  }

  async sendVerifyMail(email: string, link) {
    const user = await this.userService.getOneByEmail(email)

    await this.transporter.sendMail({
      from: this.user,
      to: email,
      subject: `Verify your email`,
      text: '',
      html: `
        <div >
            <h1>Hi ${user.username}!</h1>
            <p style="font-size:18px">Please confirm that you signed up using the email address ${email} by clicking the link below.</p>
             <a href="${link}" target="_blank" style="border: solid 1px #3498db; font-size: 18px; border-radius: 5px; box-sizing: border-box; cursor: pointer; display: inline-block; font-weight: bold; margin: 0; padding: 12px 25px; text-decoration: none; text-transform: capitalize; background-color: #3498db; border-color: #3498db; color: #ffffff;">
             Click here
             </a>
        </div>
        `
    })
  }
}
