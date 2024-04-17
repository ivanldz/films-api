import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { patchNestJsSwagger } from 'nestjs-zod';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const config = app.get(ConfigService);
  app.setGlobalPrefix('api');

  patchNestJsSwagger();
  const swaggerConf = new DocumentBuilder()
    .setTitle('Films Api')
    .setDescription('Documentación de api de películas')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConf);
  SwaggerModule.setup('docs', app, document);

  await app.listen(config.get('HTTP_PORT'));
}
bootstrap();
