import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import 'dotenv/config'
import * as cookieParser from 'cookie-parser'
import { AppModule } from './app.module'

async function bootstrap(): Promise<void> {
  const PORT = process.env.PORT ?? 3000
  const app = await NestFactory.create(AppModule, {
    cors: { origin: process.env.CLIENT_URL, credentials: true }
  })
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }))
  app.use(cookieParser())
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('The Rick & Morty API')
    .setDescription('The Rick and Morty API is a REST API based on the Rick and Morty TV show!')
    .setVersion('1.0.0')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('/api/docs', app, document)

  await app.listen(PORT)
}

bootstrap().then(() => {
  console.log(` >> 🥶️🚀Server started on ${process.env.BASE_URL} >> `)
})
