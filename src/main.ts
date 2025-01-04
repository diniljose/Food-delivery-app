import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  NestFastifyApplication,
  FastifyAdapter,
} from '@nestjs/platform-fastify';
import { globalSetupValidations } from './resources/secuirities';


async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      bodyLimit: 20971520,
    }),
  );

  await globalSetupValidations(app);

  try {
    
    await app.listen(process.env.PORT, '');
  } catch (error) {
    console.error('Error during bootstrap:', error);
  }
}
bootstrap();
