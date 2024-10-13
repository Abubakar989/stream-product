import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './modules/app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Product API')
    .setDescription('API documentation for managing products')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  // Swagger UI available at /api/docs
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT || 3000);
}

void bootstrap();
