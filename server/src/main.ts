import * as express from 'express';
import { join }  from 'path';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const CLIENT_FILES = join(__dirname, '..', '..', 'client', 'build');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.use(express.static(CLIENT_FILES));
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
