import { Logger, ValidationPipe, INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

async function setupApiDocs(app: INestApplication, globalPrefix: string) {
  const config = new DocumentBuilder()
    .setTitle('NestJS MS Gateway')
    .setDescription('API Gateway para autenticación, pagos y servicios comunes')
    .setVersion('0.0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const openapiPath = `/${globalPrefix}/openapi.json`;
  app.getHttpAdapter().get(openapiPath, (_req, res) => {
    res.json(document);
  });

  app.use(`/${globalPrefix}/reference`, apiReference({ url: openapiPath }));
  return document;
}

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors();

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const port = process.env.PORT ?? 3000;

  await setupApiDocs(app, globalPrefix);

  await app.listen(port);
  logger.log(`API Gateway running on http://localhost:${port}`);
  logger.log(`Scalar docs on http://localhost:${port}/${globalPrefix}/reference`);
  logger.log(`OpenAPI spec on http://localhost:${port}/${globalPrefix}/openapi.json`);
}
bootstrap();