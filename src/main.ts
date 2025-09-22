/* eslint-disable @typescript-eslint/no-floating-promises */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DataResponseInterceptor } from './common/interceptors/data-response/data-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('NestJs Master Class - Blog App API')
    .setDescription('Use the base API URL http://localhost:5000')
    .addServer('http://localhost:5000')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  //Enable Cors
  app.enableCors();
  app.useGlobalInterceptors(new DataResponseInterceptor());
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
