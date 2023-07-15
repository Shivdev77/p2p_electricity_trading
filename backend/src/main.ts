import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.getHttpAdapter().getInstance().disable('x-powered-by');
  app.use(cookieParser());

  app.enableCors({
    origin: true,
    credentials: true,
    // allowedHeaders: ['Content-Type'],
    // exposedHeaders: ['Set-Cookie'],
  });

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  const configService = app.get(ConfigService);

  const config = new DocumentBuilder()
    .setTitle('P2P Electricity Trading')
    .setDescription('The P2P Electricity Trading API description')
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(parseInt(configService.get('PORT'), 10));
}
bootstrap();
