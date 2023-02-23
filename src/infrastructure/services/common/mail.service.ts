import { Injectable } from '@nestjs/common'
import type { Transporter } from 'nodemailer'
import * as nodemailer from 'nodemailer'
import { EnvironmentConfigService } from '@config/environment-config.service'
import { UserService } from './user.service'

@Injectable()
export class MailService {
  private readonly transporter: Transporter
  private readonly host: string
  private readonly port: number
  private readonly user: string
  private readonly password: string

  constructor(private readonly config: EnvironmentConfigService, private readonly userService: UserService) {
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

  async sendVerifyMail(email: string, link: string): Promise<void> {
    await this.transporter.sendMail({
      from: this.user,
      to: email,
      subject: 'Verify your email',
      text: '',
      html: `
        <div >
             <h1>Hi!</h1>
            <p style="font-size:18px">Please confirm that you signed up using the email address ${email} by clicking the link below.</p>
             <a href="${link}" target="_blank">
             ${link}
             </a>
        </div>
        `
    })
  }
  async sendForgotPasswordLink(email: string, link: string) {
    await this.transporter.sendMail({
      from: this.user,
      to: email,
      subject: 'Reset your Rick&MortyAPI account password',
      text: '',
      html: `
        <div >
             <h1>Hi!</h1>
             <p style="font-size:18px">Someone (hopefully you) has requested a password reset for your Rick&MortyAPI account. Follow the link below to set a new password:</p>
             <a href="${link}" target="_blank">
             ${link}
             </a>
        </div>
        `
    })
  }
}
