import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { BackendValidationPipe } from './pipes/validation.pipe'

async function bootstrap() {
  const PORT = process.env.PORT || 3000
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix('api')
  app.useGlobalPipes(new BackendValidationPipe())
  await app.listen(PORT, () => console.log(` >> 🥶️🚀Server started on http://localhost:${PORT}/api >> `))
}

bootstrap()
