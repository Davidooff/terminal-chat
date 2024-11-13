import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AccessTokenGuard } from './common/guards';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  const reflector = new Reflector();
  app.useGlobalGuards(new AccessTokenGuard(reflector));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
