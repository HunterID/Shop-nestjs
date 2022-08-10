import helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  initializeSwagger(app);

  await initializeApp(app);
}

const initializeSwagger = (app: INestApplication): void => {
  const config = new DocumentBuilder()
    .setTitle('Shop-api')
    .setDescription('Shop description')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', in: 'header' })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
};

const initializeApp = async (app: INestApplication): Promise<void> => {
  const configService = app.get(ConfigService);
  const port = configService.get('port');

  app.use(helmet());
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
  });
};

bootstrap();
