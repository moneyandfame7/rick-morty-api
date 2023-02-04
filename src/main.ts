import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import 'dotenv/config'
import * as cookieParser from 'cookie-parser'
import { AppModule } from './app.module'

async function bootstrap() {
  const PORT = process.env.PORT || 3000
  const app = await NestFactory.create(AppModule, {
    cors: { origin: 'http://localhost:3001', credentials: true }
  })
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }))
  app.use(cookieParser())
  const config = new DocumentBuilder()
    .setTitle('The Rick & Morty API')
    .setDescription(
      'The Rick and Morty API is a REST API based on the Rick and Morty TV show.\n\n\n ' +
        'About a hundred characters, images, locations and episodes will be available to you.\n\n\n ' +
        'The Rick and Morty API is filled with canon information as shown in the TV show. ' +
        'You can also add information yourself if the user has the appropriate role (administrator).'
    )
    .setVersion('1.0.0')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('/api/docs', app, document)

  await app.listen(PORT, () => console.log(` >> 🥶️🚀Server started on ${process.env.BASE_URL} >> `))
}

bootstrap().then(() => {})
