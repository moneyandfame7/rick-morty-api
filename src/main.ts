import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import 'dotenv/config'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
  const PORT = process.env.PORT || 3000
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('api')
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }))

  const config = new DocumentBuilder()
    .setTitle('The Rick & Morty API')
    .setDescription('REST API on NestJS, Typescript, TypeOrm.')
    .setVersion('1.0.0')
    .addTag('moneyandfame')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('/api/docs', app, document)

  await app.listen(PORT, () => console.log(` >> 🥶️🚀Server started on ${process.env.BASE_URL} >> `))
}

bootstrap().then(() => {})
