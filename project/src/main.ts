import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { startSwagger, SwaggerConfig } from './config/swagger';
import mongoose from 'mongoose';
import { whitelist } from './config/cors';

async function bootstrap() {
  const api_properties = {
    API_VERSION: process.env.API_VERSION,
    HOSTNAME: process.env.API_HOSTNAME,
    PORT: process.env.API_PORT,
  };

  //mongoose.set('debug', true);
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.setGlobalPrefix(api_properties.API_VERSION);
  app.enableCors({
    origin: whitelist,
  });

  startSwagger(app);

  await app.listen(api_properties.PORT);
}
bootstrap();
