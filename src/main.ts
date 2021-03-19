import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { CoreModule } from '@ncdf/core/core.module';
import * as Sentry from '@sentry/node';
import { HttpExceptionFilter } from '@ncdf/core/exceptions/http-exception.filter';
import SentryInterceptor from '@ncdf/core/interceptor/sentry.interceptor';

const port = process.env.PORT || 8080;

async function bootstrap() {
  const app = await NestFactory.create(CoreModule, {
    // logger: [errorLevels],
  });

  Sentry.init({
    dsn: '',
  });

  app.useGlobalPipes(new ValidationPipe());
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  const swaggerOptions = new DocumentBuilder()
    .setTitle('Ncdf Example')
    .setDescription('The Ncdf API descriptions')
    .setVersion('1.0')
    .addTag('ncdf-api')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('api', app, document);
  const whitelist = ['http://localhost:3000'];
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new SentryInterceptor());
  app.enableCors();

  await app.listen(port);
}

bootstrap();