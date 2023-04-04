import { Injectable } from '@nestjs/common'
import type { Transporter } from 'nodemailer'
import * as nodemailer from 'nodemailer'

import { EnvironmentConfigService } from '@app/services/common'

@Injectable()
export class MailService {
  private readonly transporter: Transporter
  private readonly host: string
  private readonly port: number
  private readonly user: string
  private readonly password: string

  public constructor(private readonly config: EnvironmentConfigService) {
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

  public async sendVerifyMail(email: string, link: string): Promise<void> {
    const clientLink = `${this.config.getClientUrl()}/account/verify/${link}`

    await this.transporter.sendMail({
      from: this.user,
      to: email,
      subject: `${email}, please verify your account`,
      text: '',
      html: `
        <div >
        <h1>Hi, ${email}!</h1>
            <p style="font-size:18px">
              We just need to verify your email address before you can access Rickmorty API
            </p>

            <p style="font-size:18px">
              Verify your email address by click <a href="${clientLink}">here</a>
            </p>
            <p style="font-size:18px">
              <b>Thanks! – Rickmorty API</b>
            </p>
        </div>
        `
    })
  }
  public async sendForgotPasswordLink(email: string, link: string): Promise<void> {
    await this.transporter.sendMail({
      from: this.user,
      to: email,
      subject: 'Reset your Rick&MortyAPI account password',
      text: '',
      html: `
        <div >
             <h1>Hi!</h1>
             <p style="font-size:18px">Someone (hopefully you) has requested a password reset for your Rick&MortyAPI account. Follow the link below to set a new password:</p>
             <a href="${link}">
             Click here
             </a>
        </div>
        `
    })
  }
}
