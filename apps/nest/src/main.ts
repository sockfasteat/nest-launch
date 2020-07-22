/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import environment from './environments/environment';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = environment.port || 4000;
  await app.listen(port, () => {
    Logger.log(
      `🚀 🚀 🚀 Nest Server running at http://localhost:${port} \n GraphQL playground running at http://localhost:${port}/graphql`,
      'Bootstrap'
    );
  });
}

bootstrap();
