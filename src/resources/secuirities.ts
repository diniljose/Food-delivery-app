import { ValidationPipe } from "@nestjs/common";
import { NestFastifyApplication } from "@nestjs/platform-fastify";
import fastifyMultipart from '@fastify/multipart';

export async function globalSetupValidations(app: NestFastifyApplication) {
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.register(fastifyMultipart, {
      limits: {
        fileSize: 10 * 1024 * 1024, // Set max file size to 10 MB
        files: 10, // Allow up to 10 files
      },
    });
    //app.useGlobalInterceptors(new CustomErrorHandler());
  }