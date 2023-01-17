import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const PORT = process.env.PORT || 3000
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix('api')
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true // видаляє будь-які властивості запиту, тіла та параметра, які не є частиною нашого DTO
    })
  )
  await app.listen(PORT, () => console.log(` >> 🥶️🚀Server started on http://localhost:${PORT}/api >> `))
}

bootstrap()
